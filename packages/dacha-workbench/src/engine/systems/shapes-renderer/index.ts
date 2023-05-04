import type {
  System,
  SystemOptions,
  GameObjectObserver,
  GameObject,
  Store,
  Transform,
} from 'remiz'

import type { Shape } from '../../components/shape'

import {
  SHAPE_COMPONENT_NAME,
  TRANSFORM_COMPONENT_NAME,
  CURRENT_CAMERA_NAME,
} from './conts'
import { CoordinatesTransformer } from './coordinates-transformer'
import { painters } from './shape-painters'

interface ShapesRendererOptions extends SystemOptions {
  windowNodeId: string
}

export class ShapesRenderer implements System {
  private gameObjectObserver: GameObjectObserver
  private store: Store
  private window: HTMLCanvasElement
  private context: CanvasRenderingContext2D
  private canvasWidth: number
  private canvasHeight: number

  private transformer: CoordinatesTransformer

  constructor(options: SystemOptions) {
    const {
      createGameObjectObserver,
      store,
      windowNodeId,
    } = options as ShapesRendererOptions

    this.gameObjectObserver = createGameObjectObserver({
      components: [
        TRANSFORM_COMPONENT_NAME,
        SHAPE_COMPONENT_NAME,
      ],
    })
    this.store = store

    const window = document.getElementById(windowNodeId)

    if (!window) {
      throw new Error('Unable to load ShapesRenderer. Root canvas node not found')
    }
    if (!(window instanceof HTMLCanvasElement)) {
      throw new Error('Unable to load ShapesRenderer. Root canvas node should be an instance of HTMLCanvasElement')
    }

    this.window = window

    this.context = this.window.getContext('2d') as CanvasRenderingContext2D
    this.canvasWidth = this.window.clientWidth
    this.canvasHeight = this.window.clientHeight

    this.transformer = new CoordinatesTransformer()
  }

  mount(): void {
    this.handleWindowResize()
    window.addEventListener('resize', this.handleWindowResize)
  }

  unmount(): void {
    window.removeEventListener('resize', this.handleWindowResize)
  }

  private handleWindowResize = (): void => {
    this.canvasWidth = this.window.clientWidth
    this.canvasHeight = this.window.clientHeight

    this.window.width = this.canvasWidth
    this.window.height = this.canvasHeight

    this.transformer.setViewport(this.canvasWidth, this.canvasHeight)
  }

  update(): void {
    this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight)

    const currentCamera = this.store.get(CURRENT_CAMERA_NAME) as GameObject

    this.transformer.setCamera(currentCamera)

    this.gameObjectObserver.forEach((gameObject) => {
      const transform = gameObject.getComponent(TRANSFORM_COMPONENT_NAME) as Transform
      const shape = gameObject.getComponent(SHAPE_COMPONENT_NAME) as Shape

      const paintShape = painters[shape.type]
      paintShape(this.context, this.transformer, shape.properties, transform)
    })
  }
}

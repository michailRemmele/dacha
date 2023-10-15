import { System, Transform } from 'remiz'
import type {
  SystemOptions,
  GameObjectObserver,
  GameObject,
  Store,
} from 'remiz'

import { Shape } from '../../components'

import { CURRENT_CAMERA_NAME } from './conts'
import { CoordinatesTransformer } from './coordinates-transformer'
import { painters } from './shape-painters'

interface ShapesRendererOptions extends SystemOptions {
  windowNodeId: string
}

export class ShapesRenderer extends System {
  private gameObjectObserver: GameObjectObserver
  private store: Store
  private window: HTMLCanvasElement
  private context: CanvasRenderingContext2D
  private canvasWidth: number
  private canvasHeight: number

  private transformer: CoordinatesTransformer

  constructor(options: SystemOptions) {
    super()

    const {
      createGameObjectObserver,
      store,
      windowNodeId,
    } = options as ShapesRendererOptions

    this.gameObjectObserver = createGameObjectObserver({
      components: [
        Transform,
        Shape,
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
      const transform = gameObject.getComponent(Transform)
      const shape = gameObject.getComponent(Shape)

      const paintShape = painters[shape.type]
      paintShape(this.context, this.transformer, shape.properties, transform)
    })
  }
}

ShapesRenderer.systemName = 'ShapesRenderer'

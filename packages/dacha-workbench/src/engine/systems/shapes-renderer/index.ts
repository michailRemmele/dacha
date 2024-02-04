import {
  System,
  Transform,
  CameraService,
  GameObjectObserver,
} from 'remiz'
import type { SystemOptions } from 'remiz'

import { Shape } from '../../components'

import { CoordinatesTransformer } from './coordinates-transformer'
import { painters } from './shape-painters'

interface ShapesRendererOptions extends SystemOptions {
  windowNodeId: string
}

export class ShapesRenderer extends System {
  private gameObjectObserver: GameObjectObserver
  private cameraService: CameraService
  private window: HTMLCanvasElement
  private context: CanvasRenderingContext2D
  private canvasWidth: number
  private canvasHeight: number

  private transformer: CoordinatesTransformer

  constructor(options: SystemOptions) {
    super()

    const {
      scene,
      windowNodeId,
    } = options as ShapesRendererOptions

    this.gameObjectObserver = new GameObjectObserver(scene, {
      components: [
        Transform,
        Shape,
      ],
    })

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

    this.cameraService = scene.getService(CameraService)

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

    const currentCamera = this.cameraService.getCurrentCamera()

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

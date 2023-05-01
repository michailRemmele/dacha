import type {
  System,
  SystemOptions,
  GameObjectObserver,
  GameObject,
  Store,
  Transform,
  Camera,
} from 'remiz'

import type {
  Shape,
  RectangleShape,
} from '../../components/shape'

import {
  SHAPE_COMPONENT_NAME,
  TRANSFORM_COMPONENT_NAME,
  CAMERA_COMPONENT_NAME,
  CURRENT_CAMERA_NAME,
} from './conts'

interface ShapesRendererOptions extends SystemOptions {
  windowNodeId: string
}

export class ShapesRenderer implements System {
  private gameObjectObserver: GameObjectObserver
  private store: Store
  private window: HTMLCanvasElement
  private canvasContext: CanvasRenderingContext2D
  private canvasWidth: number
  private canvasHeight: number

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

    this.canvasContext = this.window.getContext('2d') as CanvasRenderingContext2D
    this.canvasWidth = this.window.clientWidth
    this.canvasHeight = this.window.clientHeight
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
  }

  update(): void {
    this.canvasContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight)

    const currentCamera = this.store.get(CURRENT_CAMERA_NAME) as GameObject
    const {
      offsetX: cameraOffsetX,
      offsetY: cameraOffsetY,
    } = currentCamera.getComponent(TRANSFORM_COMPONENT_NAME) as Transform
    const { zoom } = currentCamera.getComponent(CAMERA_COMPONENT_NAME) as Camera

    this.gameObjectObserver.forEach((gameObject) => {
      const { offsetX, offsetY } = gameObject.getComponent(TRANSFORM_COMPONENT_NAME) as Transform
      const shape = gameObject.getComponent(SHAPE_COMPONENT_NAME) as Shape

      if (shape.type === 'rectangle') {
        const {
          width,
          height,
          strokeWidth,
          strokeColor,
          color,
        } = shape.properties as RectangleShape

        this.canvasContext.fillStyle = color
        this.canvasContext.strokeStyle = strokeColor
        this.canvasContext.lineWidth = strokeWidth

        this.canvasContext.strokeRect(
          zoom * (offsetX - cameraOffsetX - width / 2) + this.canvasWidth / 2,
          zoom * (offsetY - cameraOffsetY - height / 2) + this.canvasHeight / 2,
          zoom * width,
          zoom * height,
        )
        this.canvasContext.fillRect(
          zoom * (offsetX - cameraOffsetX - width / 2) + this.canvasWidth / 2,
          zoom * (offsetY - cameraOffsetY - height / 2) + this.canvasHeight / 2,
          zoom * width,
          zoom * height,
        )
      }
    })
  }
}

import {
  System,
  Camera,
  Transform,
} from 'remiz'
import type {
  Scene,
  SystemOptions,
  Actor,
  MouseControlEvent,
} from 'remiz'

import { EventType } from '../../../events'
import { getTool } from '../../../utils/get-tool'

const ZOOM_FACTOR = 1.5
const DEFAULT_ZOOM = 1

type ZoomMode = 'in' | 'out'

export class ZoomToolSystem extends System {
  private scene: Scene
  private mainActor: Actor

  constructor(options: SystemOptions) {
    super()

    const { scene } = options

    this.scene = scene
    this.mainActor = scene.data.mainActor as Actor
  }

  mount(): void {
    this.scene.addEventListener(EventType.SelectLevel, this.handleSelectLevel)
    this.scene.addEventListener(EventType.CameraZoom, this.handleCameraZoom)
  }

  unmount(): void {
    this.scene.removeEventListener(EventType.SelectLevel, this.handleSelectLevel)
    this.scene.removeEventListener(EventType.CameraZoom, this.handleCameraZoom)
  }

  private handleSelectLevel = (): void => {
    const cameraComponent = this.mainActor.getComponent(Camera)
    cameraComponent.zoom = DEFAULT_ZOOM
  }

  private handleCameraZoom = (event: MouseControlEvent): void => {
    const {
      x,
      y,
      screenX,
      screenY,
    } = event

    const tool = getTool(this.scene)
    const zoomMode = tool.features.direction.value as ZoomMode

    const cameraComponent = this.mainActor.getComponent(Camera)
    const transform = this.mainActor.getComponent(Transform)

    if (zoomMode === 'in') {
      cameraComponent.zoom *= ZOOM_FACTOR
    } else {
      cameraComponent.zoom /= ZOOM_FACTOR
    }

    const {
      windowSizeX,
      windowSizeY,
      zoom,
    } = cameraComponent

    const windowCenterX = windowSizeX / 2
    const windowCenterY = windowSizeY / 2

    const nextX = (screenX - windowCenterX) / zoom + transform.offsetX
    const nextY = (screenY - windowCenterY) / zoom + transform.offsetY

    // Move camera in direction of zoom
    transform.offsetX += x - nextX
    transform.offsetY += y - nextY
  }
}

ZoomToolSystem.systemName = 'ZoomToolSystem'

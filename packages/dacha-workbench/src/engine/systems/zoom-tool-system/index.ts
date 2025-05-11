import {
  SceneSystem,
  Camera,
  Transform,
} from 'dacha'
import type {
  World,
  SceneSystemOptions,
  Actor,
} from 'dacha'
import type { MouseControlEvent } from 'dacha/events'

import { EventType } from '../../../events'
import { getTool } from '../../../utils/get-tool'
import { persistentStorage } from '../../../persistent-storage'

const ZOOM_FACTOR = 1.5
const DEFAULT_ZOOM = 1

type ZoomMode = 'in' | 'out'

export class ZoomToolSystem extends SceneSystem {
  private world: World
  private mainActor: Actor

  constructor(options: SceneSystemOptions) {
    super()

    const { world } = options

    this.world = world
    this.mainActor = world.data.mainActor as Actor

    this.world.addEventListener(EventType.SelectScene, this.handleSelectScene)
    this.world.addEventListener(EventType.CameraZoom, this.handleCameraZoom)
  }

  onSceneDestroy(): void {
    this.world.removeEventListener(EventType.SelectScene, this.handleSelectScene)
    this.world.removeEventListener(EventType.CameraZoom, this.handleCameraZoom)
  }

  private handleSelectScene = (): void => {
    const cameraComponent = this.mainActor.getComponent(Camera)
    cameraComponent.zoom = DEFAULT_ZOOM

    persistentStorage.set('canvas.mainActor.camera.zoom', cameraComponent.zoom)
  }

  private handleCameraZoom = (event: MouseControlEvent): void => {
    const {
      x,
      y,
      screenX,
      screenY,
    } = event

    const tool = getTool(this.world)
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

    persistentStorage.set('canvas.mainActor.camera.zoom', cameraComponent.zoom)
    persistentStorage.set('canvas.mainActor.transform.offsetX', transform.offsetX)
    persistentStorage.set('canvas.mainActor.transform.offsetY', transform.offsetY)
  }
}

ZoomToolSystem.systemName = 'ZoomToolSystem'

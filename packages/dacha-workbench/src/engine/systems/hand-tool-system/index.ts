import {
  System,
  Transform,
  Camera,
  Vector2,
} from 'dacha'
import type {
  Scene,
  SystemOptions,
  Actor,
} from 'dacha'
import type { MouseControlEvent } from 'dacha/events'

import { EventType } from '../../../events'
import { persistentStorage } from '../../../persistent-storage'

const DEFAULT_POS_X = 0
const DEFAULT_POS_Y = 0

export class HandToolSystem extends System {
  private scene: Scene
  private mainActor: Actor

  private isMoving: boolean
  private anchor: Vector2

  constructor(options: SystemOptions) {
    super()

    const { scene } = options

    this.scene = scene

    this.mainActor = scene.data.mainActor as Actor

    this.isMoving = false
    this.anchor = new Vector2(0, 0)
  }

  mount(): void {
    this.scene.addEventListener(EventType.SelectLevel, this.handleLevelChange)
    this.scene.addEventListener(EventType.CameraMoveStart, this.handleCameraMoveStart)
    this.scene.addEventListener(EventType.CameraMoveEnd, this.handleCameraMoveEnd)
    this.scene.addEventListener(EventType.CameraMove, this.handleCameraMove)
  }

  unmount(): void {
    this.scene.removeEventListener(EventType.SelectLevel, this.handleLevelChange)
    this.scene.removeEventListener(EventType.CameraMoveStart, this.handleCameraMoveStart)
    this.scene.removeEventListener(EventType.CameraMoveEnd, this.handleCameraMoveEnd)
    this.scene.removeEventListener(EventType.CameraMove, this.handleCameraMove)
  }

  private handleLevelChange = (): void => {
    const transform = this.mainActor.getComponent(Transform)
    transform.offsetX = DEFAULT_POS_X
    transform.offsetY = DEFAULT_POS_Y
  }

  private handleCameraMoveStart = (event: MouseControlEvent): void => {
    const { screenX, screenY } = event

    this.isMoving = true
    this.anchor.x = screenX
    this.anchor.y = screenY
  }

  private handleCameraMoveEnd = (): void => {
    this.isMoving = false
  }

  private handleCameraMove = (event: MouseControlEvent): void => {
    if (!this.isMoving) {
      return
    }

    const { screenX, screenY } = event

    const transform = this.mainActor.getComponent(Transform)
    const { zoom } = this.mainActor.getComponent(Camera)

    transform.offsetX += (this.anchor.x - screenX) / zoom
    transform.offsetY += (this.anchor.y - screenY) / zoom

    persistentStorage.set('canvas.mainActor.transform.offsetX', transform.offsetX)
    persistentStorage.set('canvas.mainActor.transform.offsetY', transform.offsetY)

    this.anchor.x = screenX
    this.anchor.y = screenY
  }
}

HandToolSystem.systemName = 'HandToolSystem'

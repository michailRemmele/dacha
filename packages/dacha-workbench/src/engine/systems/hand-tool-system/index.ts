import {
  SceneSystem,
  Transform,
  Camera,
  Vector2,
} from 'dacha'
import type {
  World,
  SceneSystemOptions,
  Actor,
} from 'dacha'
import type { MouseControlEvent } from 'dacha/events'

import { EventType } from '../../../events'
import { persistentStorage } from '../../../persistent-storage'

const DEFAULT_POS_X = 0
const DEFAULT_POS_Y = 0

export class HandToolSystem extends SceneSystem {
  private world: World
  private mainActor: Actor

  private isMoving: boolean
  private anchor: Vector2

  constructor(options: SceneSystemOptions) {
    super()

    const { world } = options

    this.world = world
    this.mainActor = world.data.mainActor as Actor

    this.isMoving = false
    this.anchor = new Vector2(0, 0)

    this.world.addEventListener(EventType.SelectScene, this.handleSceneChange)
    this.world.addEventListener(EventType.CameraMoveStart, this.handleCameraMoveStart)
    this.world.addEventListener(EventType.CameraMoveEnd, this.handleCameraMoveEnd)
    this.world.addEventListener(EventType.CameraMove, this.handleCameraMove)
  }

  onSceneDestroy(): void {
    this.world.removeEventListener(EventType.SelectScene, this.handleSceneChange)
    this.world.removeEventListener(EventType.CameraMoveStart, this.handleCameraMoveStart)
    this.world.removeEventListener(EventType.CameraMoveEnd, this.handleCameraMoveEnd)
    this.world.removeEventListener(EventType.CameraMove, this.handleCameraMove)
  }

  private handleSceneChange = (): void => {
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

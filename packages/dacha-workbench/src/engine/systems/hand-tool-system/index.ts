import {
  System,
  Transform,
  Camera,
  Vector2,
} from 'remiz'
import type {
  SystemOptions,
  GameObject,
  MessageBus,
} from 'remiz'

import {
  CAMERA_MOVE_START_MSG,
  CAMERA_MOVE_END_MSG,
  CAMERA_MOVE_MSG,
  SELECT_LEVEL_MSG,
} from '../../../consts/message-types'
import type {
  SelectLevelMessage,
  MouseInputMessage,
} from '../../../types/messages'

const DEFAULT_POS_X = 0
const DEFAULT_POS_Y = 0

export class HandToolSystem extends System {
  private messageBus: MessageBus
  private mainObject: GameObject

  private isMoving: boolean
  private anchor: Vector2

  constructor(options: SystemOptions) {
    super()

    const { messageBus, sceneContext } = options

    this.messageBus = messageBus

    this.mainObject = sceneContext.data.mainObject as GameObject

    this.isMoving = false
    this.anchor = new Vector2(0, 0)
  }

  private handleLevelChange(): void {
    const messages = this.messageBus.get(SELECT_LEVEL_MSG) as Array<SelectLevelMessage> | undefined

    if (!messages) {
      return
    }

    const transform = this.mainObject.getComponent(Transform)
    transform.offsetX = DEFAULT_POS_X
    transform.offsetY = DEFAULT_POS_Y
  }

  private handleMoveStartMessages(): void {
    const startMoveMessages = (this.messageBus.get(CAMERA_MOVE_START_MSG) || [])

    if (!startMoveMessages.length) {
      return
    }

    const {
      screenX,
      screenY,
    } = startMoveMessages[startMoveMessages.length - 1] as MouseInputMessage

    this.isMoving = true
    this.anchor.x = screenX
    this.anchor.y = screenY
  }

  private handleMoveEndMessages(): void {
    const endMoveMessages = (this.messageBus.get(CAMERA_MOVE_END_MSG) || [])

    if (!endMoveMessages.length) {
      return
    }

    this.isMoving = false
  }

  private handleMoveMessages(): void {
    if (!this.isMoving) {
      return
    }

    const moveMessages = (this.messageBus.get(CAMERA_MOVE_MSG) || [])

    if (!moveMessages.length) {
      return
    }

    const {
      screenX,
      screenY,
    } = moveMessages[moveMessages.length - 1] as MouseInputMessage

    const transform = this.mainObject.getComponent(Transform)
    const { zoom } = this.mainObject.getComponent(Camera)

    transform.offsetX += (this.anchor.x - screenX) / zoom
    transform.offsetY += (this.anchor.y - screenY) / zoom

    this.anchor.x = screenX
    this.anchor.y = screenY
  }

  update(): void {
    this.handleLevelChange()

    this.handleMoveStartMessages()
    this.handleMoveEndMessages()
    this.handleMoveMessages()
  }
}

HandToolSystem.systemName = 'HandToolSystem'

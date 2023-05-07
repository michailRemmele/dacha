import { Vector2 } from 'remiz'
import type {
  GameObjectObserver,
  MessageBus,
  Transform,
} from 'remiz'

import {
  SELECTION_MOVE_START_MSG,
  SELECTION_MOVE_END_MSG,
  SELECTION_MOVE_MSG,
  COMMAND_MSG,
} from '../../../../consts/message-types'
import { SET } from '../../../../command-types'
import {
  TRANSFORM_COMPONENT_NAME,
} from '../conts'
import { buildGameObjectPath } from '../utils'
import type { MouseInputMessage } from '../types'
import type { Store } from '../../../../store'

import { isFloatEqual } from './utils'

interface SelectionMovementSubsytemOptions {
  messageBus: MessageBus
  gameObjectObserver: GameObjectObserver
  configStore: Store
}

export class SelectionMovementSubsytem {
  private messageBus: MessageBus
  private gameObjectObserver: GameObjectObserver
  private configStore: Store

  private isMoving: boolean
  private pointer: Vector2
  private pointerStart: Vector2

  constructor({
    messageBus,
    gameObjectObserver,
    configStore,
  }: SelectionMovementSubsytemOptions) {
    this.messageBus = messageBus
    this.gameObjectObserver = gameObjectObserver
    this.configStore = configStore

    this.isMoving = false
    this.pointer = new Vector2(0, 0)
    this.pointerStart = new Vector2(0, 0)
  }

  private handleMoveStartMessages(): void {
    const startMoveMessages = this.messageBus.get(SELECTION_MOVE_START_MSG)
    if (!startMoveMessages?.length) {
      return
    }

    const { x, y } = startMoveMessages.at(-1) as MouseInputMessage

    this.isMoving = true
    this.pointer.x = x
    this.pointer.y = y

    this.pointerStart.x = x
    this.pointerStart.y = y
  }

  private handleMoveEndMessages(selectionId: string, levelId: string): void {
    const endMoveMessages = this.messageBus.get(SELECTION_MOVE_END_MSG)
    if (!endMoveMessages?.length) {
      return
    }

    this.isMoving = false

    const selectedObject = this.gameObjectObserver.getById(selectionId)
    if (selectedObject === undefined) {
      return
    }

    const objectPath = buildGameObjectPath(selectedObject, levelId)
    const transformPath = objectPath.concat('components', 'name:transform', 'config')

    const transform = selectedObject.getComponent(TRANSFORM_COMPONENT_NAME) as Transform

    const transformConfig = this.configStore.get(transformPath) as Record<string, unknown>

    if (isFloatEqual(this.pointer.x, this.pointerStart.x)
      && isFloatEqual(this.pointer.y, this.pointerStart.y)
    ) {
      return
    }

    this.messageBus.send({
      type: COMMAND_MSG,
      command: SET,
      options: {
        path: transformPath,
        value: {
          ...transformConfig,
          offsetX: Math.round(transform.offsetX),
          offsetY: Math.round(transform.offsetY),
        },
      },
    })
  }

  private handleMoveMessages(selectionId: string): void {
    if (!this.isMoving) {
      return
    }

    const moveMessages = this.messageBus.get(SELECTION_MOVE_MSG)
    if (!moveMessages?.length) {
      return
    }

    const { x, y } = moveMessages.at(-1) as MouseInputMessage

    const selectedObject = this.gameObjectObserver.getById(selectionId)
    if (selectedObject === undefined) {
      return
    }

    const transform = selectedObject.getComponent(TRANSFORM_COMPONENT_NAME) as Transform

    transform.offsetX -= this.pointer.x - x
    transform.offsetY -= this.pointer.y - y

    this.pointer.x = x
    this.pointer.y = y
  }

  update(selectionId: string, levelId: string): void {
    this.handleMoveStartMessages()
    this.handleMoveEndMessages(selectionId, levelId)
    this.handleMoveMessages(selectionId)
  }
}

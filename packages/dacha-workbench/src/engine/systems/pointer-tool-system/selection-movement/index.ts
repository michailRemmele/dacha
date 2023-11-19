import {
  Transform,
  Sprite,
} from 'remiz'
import type {
  GameObjectObserver,
  MessageBus,
  SceneContext,
} from 'remiz'

import {
  SELECTION_MOVE_START_MSG,
  SELECTION_MOVE_END_MSG,
  SELECTION_MOVE_MSG,
  COMMAND_MSG,
} from '../../../../consts/message-types'
import { SET } from '../../../../command-types'
import { ROOT_SCOPE } from '../../../../consts/command-scopes'
import { buildGameObjectPath } from '../utils'
import { getTool } from '../../../../utils/get-tool'
import { getGridValue, getGridStep } from '../../../../utils/grid'
import type { MouseInputMessage, CommandMessage } from '../../../../types/messages'
import type { Store } from '../../../../store'

import {
  isFloatEqual,
  getSizeX,
  getSizeY,
} from './utils'

export interface Position {
  x: number
  y: number
}

interface SelectionMovementSubsystemOptions {
  messageBus: MessageBus
  gameObjectObserver: GameObjectObserver
  sceneContext: SceneContext
}

export class SelectionMovementSubsystem {
  private messageBus: MessageBus
  private gameObjectObserver: GameObjectObserver
  private configStore: Store
  private sceneContext: SceneContext

  private isMoving: boolean
  private selectionStart: Position
  private pointerStart: Position

  constructor({
    messageBus,
    gameObjectObserver,
    sceneContext,
  }: SelectionMovementSubsystemOptions) {
    this.messageBus = messageBus
    this.gameObjectObserver = gameObjectObserver
    this.configStore = sceneContext.data.configStore as Store
    this.sceneContext = sceneContext

    this.isMoving = false
    this.selectionStart = { x: 0, y: 0 }
    this.pointerStart = { x: 0, y: 0 }
  }

  private handleMoveStartMessages(selectionId: string): void {
    const startMoveMessages = this.messageBus.get(SELECTION_MOVE_START_MSG)
    if (!startMoveMessages?.length) {
      return
    }

    const { x, y } = startMoveMessages.at(-1) as MouseInputMessage

    const selectedObject = this.gameObjectObserver.getById(selectionId)
    if (selectedObject === undefined) {
      return
    }

    const transform = selectedObject.getComponent(Transform)
    if (transform === undefined) {
      return
    }

    this.isMoving = true

    this.pointerStart.x = x
    this.pointerStart.y = y

    this.selectionStart.x = transform.offsetX
    this.selectionStart.y = transform.offsetY
  }

  private handleMoveEndMessages(selectionId: string, levelId: string): void {
    if (!this.isMoving) {
      return
    }

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
    const transformPath = objectPath.concat('components', `name:${Transform.componentName}`, 'config')

    const transform = selectedObject.getComponent(Transform)
    if (transform === undefined) {
      return
    }

    const transformConfig = this.configStore.get(transformPath) as Record<string, unknown>

    if (
      isFloatEqual(transform.offsetX, this.selectionStart.x)
      && isFloatEqual(transform.offsetY, this.selectionStart.y)
    ) {
      return
    }

    const commandMessage: CommandMessage = {
      type: COMMAND_MSG,
      command: SET,
      scope: ROOT_SCOPE,
      options: {
        path: transformPath,
        value: {
          ...transformConfig,
          offsetX: transform.relativeOffsetX,
          offsetY: transform.relativeOffsetY,
        },
      },
    }
    this.messageBus.send(commandMessage)
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

    const transform = selectedObject.getComponent(Transform)
    if (transform === undefined) {
      return
    }

    const tool = getTool(this.sceneContext)
    const snapToGrid = tool.features.grid.value as boolean

    const offsetX = this.selectionStart.x - this.pointerStart.x + x
    const offsetY = this.selectionStart.y - this.pointerStart.y + y

    if (snapToGrid) {
      const sprite = selectedObject.getComponent(Sprite)

      const gridStep = getGridStep(this.sceneContext)

      transform.offsetX = getGridValue(offsetX, getSizeX(transform, sprite), gridStep)
      transform.offsetY = getGridValue(offsetY, getSizeY(transform, sprite), gridStep)
    } else {
      transform.offsetX = Math.round(offsetX)
      transform.offsetY = Math.round(offsetY)
    }
  }

  update(selectionId: string, levelId: string): void {
    this.handleMoveStartMessages(selectionId)
    this.handleMoveEndMessages(selectionId, levelId)
    this.handleMoveMessages(selectionId)
  }
}

import type {
  System,
  SystemOptions,
  MessageBus,
  Message,
  SceneContext,
} from 'remiz'
import { RendererService } from 'remiz'

import {
  SELECT_GAME_OBJECT,
  INSPECT_ENTITY_MSG,
  SELECT_LEVEL_MSG,
} from '../../../consts/message-types'
import type { SelectLevelMessage } from '../../../types/messages'

import { buildGameObjectPath } from './utils'

interface MouseInputMessage extends Message {
  screenX: number
  screenY: number
}

export class PointerToolSystem implements System {
  private messageBus: MessageBus
  private sceneContext: SceneContext
  private selectedLevelId?: string

  constructor(options: SystemOptions) {
    const { messageBus, sceneContext } = options

    this.messageBus = messageBus
    this.sceneContext = sceneContext
  }

  private handleLevelChange(): void {
    const messages = this.messageBus.get(SELECT_LEVEL_MSG) as Array<SelectLevelMessage> | undefined

    if (!messages) {
      return
    }

    const { levelId } = messages[0]

    this.selectedLevelId = levelId
  }

  update(): void {
    this.handleLevelChange()

    if (this.selectedLevelId === undefined) {
      return
    }

    // TODO: Watch selection cancel using message bus

    const moveMessages = (this.messageBus.get(SELECT_GAME_OBJECT) || [])

    if (!moveMessages.length) {
      return
    }

    const rendererService = this.sceneContext.getService(RendererService)

    const { screenX, screenY } = moveMessages[moveMessages.length - 1] as MouseInputMessage

    const selectedGameObject = rendererService.intersectsWithPoint(screenX, screenY)[0]

    if (selectedGameObject === undefined) {
      this.messageBus.send({
        type: INSPECT_ENTITY_MSG,
        path: undefined,
      })
      return
    }

    this.messageBus.send({
      type: INSPECT_ENTITY_MSG,
      path: buildGameObjectPath(selectedGameObject, this.selectedLevelId),
    })

    // TODO: Draw outline inside mainObject and track position of selected game object
  }
}

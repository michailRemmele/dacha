import type {
  System,
  SystemOptions,
  MessageBus,
  SceneContext,
  GameObject,
  GameObjectSpawner,
  GameObjectDestroyer,
  GameObjectObserver,
} from 'remiz'
import { RendererService } from 'remiz'

import {
  SELECTION_MOVE_START_MSG,
  INSPECT_ENTITY_MSG,
  SELECT_LEVEL_MSG,
} from '../../../consts/message-types'
import type {
  SelectLevelMessage,
  InspectEntityMessage,
  MouseInputMessage,
} from '../../../types/messages'
import type { Store } from '../../../store'

import { SelectionMovementSubsystem } from './selection-movement'
import { buildGameObjectPath, updateFrameSize } from './utils'
import { LEVEL_PATH_LEGTH } from './consts'

export class PointerToolSystem implements System {
  private messageBus: MessageBus
  private sceneContext: SceneContext
  private gameObjectSpawner: GameObjectSpawner
  private gameObjectDestroyer: GameObjectDestroyer
  private gameObjectObserver: GameObjectObserver
  private selectedLevelId?: string

  private mainObject: GameObject

  private selectedObjectId?: string
  private frame?: GameObject

  private selectionMovementSubsystem: SelectionMovementSubsystem

  constructor(options: SystemOptions) {
    const {
      messageBus,
      sceneContext,
      gameObjectSpawner,
      gameObjectDestroyer,
      createGameObjectObserver,
    } = options

    this.messageBus = messageBus
    this.sceneContext = sceneContext
    this.gameObjectSpawner = gameObjectSpawner
    this.gameObjectDestroyer = gameObjectDestroyer
    this.gameObjectObserver = createGameObjectObserver({})

    this.mainObject = sceneContext.data.mainObject as GameObject

    this.selectionMovementSubsystem = new SelectionMovementSubsystem({
      messageBus,
      gameObjectObserver: this.gameObjectObserver,
      sceneContext: this.sceneContext,
    })
  }

  private handleLevelChange(): void {
    const messages = this.messageBus.get(SELECT_LEVEL_MSG) as Array<SelectLevelMessage> | undefined
    if (!messages) {
      return
    }

    const { levelId } = messages[0]

    this.selectedLevelId = levelId
  }

  private handleInspectEntityMessages(): void {
    const inspectMessages = this.messageBus.get(INSPECT_ENTITY_MSG)
    if (!inspectMessages?.length) {
      return
    }

    const { path } = inspectMessages.at(-1) as InspectEntityMessage

    if (path !== undefined && path[0] === 'levels' && path.length > LEVEL_PATH_LEGTH) {
      this.selectedObjectId = path.at(-1)?.split(':').at(-1)
    } else {
      this.selectedObjectId = undefined
    }
  }

  private handleSelectionMessages(): void {
    if (this.selectedLevelId === undefined) {
      return
    }

    const selectionMessages = this.messageBus.get(SELECTION_MOVE_START_MSG)
    if (!selectionMessages?.length) {
      return
    }

    const { screenX, screenY } = selectionMessages.at(-1) as MouseInputMessage

    const rendererService = this.sceneContext.getService(RendererService)

    const selectedObject = rendererService
      .intersectsWithPoint(screenX, screenY)
      .find((gameObject) => gameObject.getAncestor().id !== this.mainObject.id)

    this.messageBus.send({
      type: INSPECT_ENTITY_MSG,
      path: selectedObject !== undefined
        ? buildGameObjectPath(selectedObject, this.selectedLevelId)
        : undefined,
    })

    this.selectedObjectId = selectedObject?.id
  }

  private deleteFrame(): void {
    if (this.frame === undefined) {
      return
    }

    this.gameObjectDestroyer.destroy(this.frame)
    this.frame = undefined
  }

  private updateFrame(): void {
    if (this.frame === undefined && this.selectedObjectId !== undefined) {
      this.frame = this.gameObjectSpawner.spawn('frame')
      this.mainObject.appendChild(this.frame)
    }

    if (this.selectedObjectId === undefined) {
      this.deleteFrame()
      return
    }

    if (this.frame === undefined || this.selectedObjectId === undefined) {
      return
    }

    const selectedObject = this.gameObjectObserver.getById(this.selectedObjectId)
    if (selectedObject === undefined) {
      return
    }

    updateFrameSize(this.frame, selectedObject)
  }

  update(): void {
    this.handleLevelChange()
    this.handleInspectEntityMessages()
    this.handleSelectionMessages()

    if (this.selectedLevelId !== undefined && this.selectedObjectId !== undefined) {
      this.selectionMovementSubsystem.update(this.selectedObjectId, this.selectedLevelId)
    }

    this.updateFrame()
  }
}

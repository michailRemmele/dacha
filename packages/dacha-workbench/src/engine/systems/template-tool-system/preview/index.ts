import type {
  GameObjectCreator,
  GameObjectDestroyer,
  GameObjectSpawner,
  MessageBus,
  GameObject,
  Transform,
  SceneContext,
  TemplateConfig,
} from 'remiz'

import {
  TOOL_NAME,
  TRANSFORM_COMPONENT_NAME,
} from '../consts'
import { SELECT_TOOL_MSG } from '../../../../consts/message-types'
import { getTool } from '../../../../utils/get-tool'
import { includesArray } from '../../../../utils/includes-array'
import type { Tool } from '../../../components'
import type { Store } from '../../../../store'
import type { SelectToolMessage } from '../../../../types/messages'

interface PreviewSubsystemOptions {
  gameObjectCreator: GameObjectCreator
  gameObjectDestroyer: GameObjectDestroyer
  gameObjectSpawner: GameObjectSpawner
  sceneContext: SceneContext
  messageBus: MessageBus
}

export class PreviewSubsystem {
  private gameObjectCreator: GameObjectCreator
  private gameObjectDestroyer: GameObjectDestroyer
  private gameObjectSpawner: GameObjectSpawner
  private mainObject: GameObject
  private configStore: Store
  private sceneContext: SceneContext
  private messageBus: MessageBus

  private preview?: GameObject

  private unsubscribe: () => void

  constructor({
    gameObjectCreator,
    gameObjectDestroyer,
    gameObjectSpawner,
    sceneContext,
    messageBus,
  }: PreviewSubsystemOptions) {
    this.gameObjectCreator = gameObjectCreator
    this.gameObjectDestroyer = gameObjectDestroyer
    this.gameObjectSpawner = gameObjectSpawner
    this.messageBus = messageBus
    this.sceneContext = sceneContext

    this.mainObject = this.sceneContext.data.mainObject as GameObject
    this.configStore = this.sceneContext.data.configStore as Store

    this.unsubscribe = this.configStore.subscribe(this.handleTemplatesUpdate)
  }

  private deletePreview(): void {
    if (this.preview === undefined) {
      return
    }

    this.gameObjectDestroyer.destroy(this.preview)
    this.preview = undefined
  }

  // TODO: Simplify after gameObject/template creation refactoring
  private spawnPreview(templateId: string): GameObject {
    const preview = this.gameObjectCreator.create({
      templateId,
      fromTemplate: true,
      isNew: true,
    })
    this.gameObjectSpawner.spawn(preview)
    this.mainObject.appendChild(preview)

    return preview
  }

  /**
   * Listens template update to sync template feature value and reset preview
   * if selected template was changed
   */
  private handleTemplatesUpdate = (path: Array<string>): void => {
    const tool = getTool(this.sceneContext)
    if (tool.name !== TOOL_NAME || !includesArray(path, ['templates'])) {
      return
    }

    const templates = this.configStore.get(['templates']) as Array<TemplateConfig>
    const templateId = tool.features.templateId.value as string | undefined

    if (templateId !== undefined && templates.every((template) => template.id !== templateId)) {
      tool.features.templateId.value = templates[0]?.id
    }
    if (tool.features.templateId.value === undefined && templates.length > 0) {
      tool.features.templateId.value = templates[0].id
    }

    if (this.preview === undefined) {
      return
    }
    if (!includesArray(path, ['templates', `id:${this.preview.templateId as string}`])) {
      return
    }

    this.deletePreview()
  }

  /**
   * Tries to pick an initial value for template feature once template tool is selected
   */
  private handleToolSelectMessages(): void {
    const messages = this.messageBus.get(SELECT_TOOL_MSG)
    if (!messages?.length) {
      return
    }

    const { name } = messages.at(-1) as SelectToolMessage
    if (name !== TOOL_NAME) {
      return
    }

    const templates = this.configStore.get(['templates']) as Array<TemplateConfig>
    const tool = getTool(this.sceneContext)

    if (tool.features.templateId.value === undefined && templates.length > 0) {
      tool.features.templateId.value = templates[0].id
    }
  }

  private updatePreview(tool: Tool, x: number, y: number): void {
    const templateId = tool.features.templateId.value as string | undefined

    if (templateId === undefined) {
      return
    }
    if (this.preview !== undefined && this.preview.templateId !== templateId) {
      this.deletePreview()
    }
    if (this.preview === undefined) {
      this.preview = this.spawnPreview(templateId)
    }

    const transform = this.preview.getComponent(TRANSFORM_COMPONENT_NAME) as Transform | undefined
    if (transform !== undefined) {
      transform.offsetX = x
      transform.offsetY = y
    }
  }

  unmount(): void {
    this.unsubscribe()
  }

  update(x: number | null, y: number | null): void {
    this.handleToolSelectMessages()

    const tool = getTool(this.sceneContext)

    if (tool.name !== TOOL_NAME || x === null || y === null) {
      this.deletePreview()
      return
    }

    const preview = tool.features.preview.value as boolean
    if (!preview) {
      this.deletePreview()
      return
    }

    this.updatePreview(tool, x, y)
  }
}

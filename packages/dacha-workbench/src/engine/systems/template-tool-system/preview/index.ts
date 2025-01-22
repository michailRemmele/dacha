import { Transform } from 'dacha'
import type {
  Scene,
  ActorCreator,
  ActorSpawner,
  Actor,
  TemplateConfig,
} from 'dacha'

import { EventType } from '../../../../events'
import type { SelectToolEvent } from '../../../../events'
import { TOOL_NAME } from '../consts'
import { getTool } from '../../../../utils/get-tool'
import { includesArray } from '../../../../utils/includes-array'
import { Tool } from '../../../components'
import type { CommanderStore } from '../../../../store'

interface PreviewSubsystemOptions {
  scene: Scene
  actorCreator: ActorCreator
  actorSpawner: ActorSpawner
}

export class PreviewSubsystem {
  private scene: Scene
  private actorCreator: ActorCreator
  private mainActor: Actor
  private configStore: CommanderStore

  private preview?: Actor

  private unsubscribe?: () => void

  constructor({
    scene,
    actorCreator,
  }: PreviewSubsystemOptions) {
    this.scene = scene
    this.actorCreator = actorCreator

    this.mainActor = this.scene.data.mainActor as Actor
    this.configStore = this.scene.data.configStore as CommanderStore
  }

  mount(): void {
    this.scene.addEventListener(EventType.SelectTool, this.handleSelectTool)
    this.unsubscribe = this.configStore.subscribe(this.handleTemplatesUpdate)
  }

  unmount(): void {
    this.scene.removeEventListener(EventType.SelectTool, this.handleSelectTool)
    this.unsubscribe?.()
  }

  /**
   * Tries to pick an initial value for template feature once template tool is selected
   */
  private handleSelectTool = (event: SelectToolEvent): void => {
    const { name } = event
    if (name !== TOOL_NAME) {
      return
    }

    const templates = this.configStore.get(['templates']) as Array<TemplateConfig>
    const tool = getTool(this.scene)

    if (tool.features.templateId.value === undefined && templates.length > 0) {
      tool.features.templateId.value = templates[0].id
    }
  }

  /**
   * Listens template update to sync template feature value and reset preview
   * if selected template was changed
   */
  private handleTemplatesUpdate = (path: Array<string>): void => {
    const tool = getTool(this.scene)
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

  private deletePreview(): void {
    if (this.preview === undefined) {
      return
    }

    this.preview.remove()
    this.preview = undefined
  }

  // TODO: Simplify after actor/template creation refactoring
  private spawnPreview(templateId: string): Actor {
    const preview = this.actorCreator.create({
      templateId,
      isNew: true,
    })
    this.mainActor.appendChild(preview)

    return preview
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

    const transform = this.preview.getComponent(Transform)
    if (transform !== undefined) {
      transform.offsetX = x
      transform.offsetY = y
    }
  }

  update(x: number | null, y: number | null): void {
    const tool = getTool(this.scene)

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

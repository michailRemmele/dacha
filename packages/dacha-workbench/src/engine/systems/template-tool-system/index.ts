import { SceneSystem, Transform } from 'dacha'
import type {
  World,
  Scene,
  SceneSystemOptions,
  TemplateConfig,
  ActorConfig,
  ActorCreator,
  Actor,
} from 'dacha'
import type { MouseControlEvent } from 'dacha/events'

import { EventType } from '../../../events'
import type {
  SelectSceneEvent,
  InspectEntityEvent,
  SelectToolEvent,
  SetToolFeatureValueEvent,
} from '../../../events'
import { ADD_VALUE } from '../../../command-types'
import { ROOT_SCOPE } from '../../../consts/scopes'
import type { CommanderStore } from '../../../store'

import { includesArray } from '../../../utils/includes-array'
import { getTool } from '../../../utils/get-tool'
import { getSavedSelectedSceneId } from '../../../utils/get-saved-selected-scene-id'
import { getSavedInspectedEntity } from '../../../utils/get-saved-inspected-entity'
import { getActorIdByPath } from '../../../utils/get-actor-id-by-path'

import { TOOL_NAME, PREVIEW_FEATURE_NAME, VIEW_COMPONENTS } from './consts'
import { createFromTemplate, updatePreviewPosition, isActorPath } from './utils'
import type { Position, ViewComponent } from './types'

export class TemplateToolSystem extends SceneSystem {
  private world: World
  private scene: Scene
  private mainActor: Actor
  private configStore: CommanderStore
  private actorCreator: ActorCreator

  private selectedSceneId?: string
  private selectedActorPath?: string[]

  private cursor: Position

  private preview?: Actor

  private unsubscribeStore?: () => void

  constructor(options: SceneSystemOptions) {
    super()

    const { world, scene } = options

    this.world = world
    this.scene = scene
    this.mainActor = this.world.data.mainActor as Actor
    this.configStore = this.world.data.configStore as CommanderStore
    this.actorCreator = this.world.data.actorCreator as ActorCreator

    this.selectedSceneId = getSavedSelectedSceneId(this.configStore)

    const entityPath = getSavedInspectedEntity(this.configStore)
    this.selectedActorPath = isActorPath(entityPath) ? entityPath : undefined

    this.cursor = { x: null, y: null }

    this.world.addEventListener(EventType.SelectScene, this.handleSelectScene)
    this.world.addEventListener(EventType.InspectedEntityChange, this.handleInspectEntity)
    this.world.addEventListener(EventType.ToolCursorMove, this.handleToolCursorMove)
    this.world.addEventListener(EventType.ToolCursorLeave, this.handleToolCursorLeave)
    this.world.addEventListener(EventType.AddFromTemplate, this.handleAddFromTemplate)
    this.world.addEventListener(EventType.SelectTool, this.handleSelectTool)
    this.world.addEventListener(EventType.SetToolFeatureValue, this.handleSetToolFeatureValue)
    this.unsubscribeStore = this.configStore.subscribe(this.handleTemplatesUpdate)
  }

  onSceneDestroy(): void {
    this.world.removeEventListener(EventType.SelectScene, this.handleSelectScene)
    this.world.removeEventListener(EventType.InspectedEntityChange, this.handleInspectEntity)
    this.world.removeEventListener(EventType.ToolCursorMove, this.handleToolCursorMove)
    this.world.removeEventListener(EventType.ToolCursorLeave, this.handleToolCursorLeave)
    this.world.removeEventListener(EventType.AddFromTemplate, this.handleAddFromTemplate)
    this.world.removeEventListener(EventType.SetToolFeatureValue, this.handleSetToolFeatureValue)
    this.world.removeEventListener(EventType.SelectTool, this.handleSelectTool)
    this.unsubscribeStore?.()
  }

  private handleSelectScene = (event: SelectSceneEvent): void => {
    const { sceneId } = event
    this.selectedSceneId = sceneId
  }

  private handleInspectEntity = (event: InspectEntityEvent): void => {
    this.selectedActorPath = isActorPath(event.path) ? event.path : undefined
  }

  private handleToolCursorMove = (event: MouseControlEvent): void => {
    const { x, y } = event
    this.cursor.x = x
    this.cursor.y = y
  }

  private handleToolCursorLeave = (): void => {
    this.cursor.x = null
    this.cursor.y = null
  }

  private handleAddFromTemplate = (event: MouseControlEvent): void => {
    if (!this.selectedSceneId) {
      return
    }

    const { x, y } = event
    this.cursor.x = x
    this.cursor.y = y
    updatePreviewPosition(
      this.cursor,
      this.world,
      this.preview,
    )

    const tool = getTool(this.world)

    const templateId = tool.features.templateId.value as string | undefined
    const nestToSelected = tool.features.nestToSelected.value as string | undefined

    if (!templateId) {
      return
    }

    const template = this.configStore.get(['templates', `id:${templateId}`]) as TemplateConfig

    const transform = this.preview?.getComponent(Transform)

    let actorOffsetX = transform?.offsetX ?? 0
    let actorOffsetY = transform?.offsetY ?? 0

    if (nestToSelected && this.selectedActorPath) {
      const selectedActorId = getActorIdByPath(this.selectedActorPath) as string
      const parentActor = this.scene.findChildById(selectedActorId)
      const parentTransform = parentActor?.getComponent(Transform)

      actorOffsetX -= parentTransform?.offsetX ?? 0
      actorOffsetY -= parentTransform?.offsetY ?? 0
    }

    const path = nestToSelected && this.selectedActorPath
      ? this.selectedActorPath.concat('children')
      : ['scenes', `id:${this.selectedSceneId}`, 'actors']

    const siblings = this.configStore.get(path) as ActorConfig[]

    const actor = createFromTemplate(template, siblings, actorOffsetX, actorOffsetY)

    this.configStore.dispatch({
      command: ADD_VALUE,
      scope: ROOT_SCOPE,
      options: { path, value: actor },
    })
  }

  /**
   * Tries to pick an initial value for template feature once template tool is selected
   */
  private handleSelectTool = (event: SelectToolEvent): void => {
    const { name } = event
    if (name !== TOOL_NAME) {
      return
    }

    const templates = this.configStore.get(['templates']) as TemplateConfig[]
    const tool = getTool(this.world)

    if (tool.features.templateId.value === undefined && templates.length > 0) {
      this.world.dispatchEvent(EventType.SetToolFeatureValue, {
        name: 'templateId',
        value: templates[0].id,
      })
    }
  }

  /**
   * Listens preview visiblity update and reset preview in visible state
   */
  private handleSetToolFeatureValue = (event: SetToolFeatureValueEvent): void => {
    const tool = getTool(this.world)
    if (tool.name !== TOOL_NAME) {
      return
    }

    const { name, value } = event
    if (name === PREVIEW_FEATURE_NAME && value === true) {
      this.deletePreview()
    }
  }

  /**
   * Listens template update to sync template feature value and reset preview
   * if selected template was changed
   */
  private handleTemplatesUpdate = (path: string[]): void => {
    const tool = getTool(this.world)
    if (tool.name !== TOOL_NAME || !includesArray(path, ['templates'])) {
      return
    }

    const templates = this.configStore.get(['templates']) as TemplateConfig[]
    const templateId = tool.features.templateId.value as string | undefined

    if (templateId && templates.every((template) => template.id !== templateId)) {
      tool.features.templateId.value = templates[0]?.id
    }
    if (!templateId && templates.length > 0) {
      tool.features.templateId.value = templates[0].id
    }

    if (!this.preview) {
      return
    }
    if (!includesArray(path, ['templates', `id:${this.preview.templateId as string}`])) {
      return
    }

    this.deletePreview()
  }

  private deletePreview(): void {
    if (!this.preview) {
      return
    }

    this.preview.remove()
    this.preview = undefined
  }

  private hidePreview(): void {
    if (!this.preview) {
      return
    }

    VIEW_COMPONENTS.forEach((name) => {
      const viewComponent = this.preview?.getComponent(name) as ViewComponent | undefined
      if (viewComponent) {
        viewComponent.material.options.opacity = 0
      }
    })
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

  private updatePreview(): void {
    const tool = getTool(this.world)

    const { x, y } = this.cursor

    if (tool.name !== TOOL_NAME || x === null || y === null) {
      this.deletePreview()
      return
    }

    const templateId = tool.features.templateId.value as string | undefined
    const preview = tool.features.preview.value as boolean

    if (!templateId) {
      return
    }
    if (this.preview && this.preview.templateId !== templateId) {
      this.deletePreview()
    }
    if (!this.preview) {
      this.preview = this.spawnPreview(templateId)
    }
    if (!preview) {
      this.hidePreview()
    }
  }

  update(): void {
    if (!this.selectedSceneId) {
      return
    }

    this.updatePreview()

    updatePreviewPosition(
      this.cursor,
      this.world,
      this.preview,
    )
  }
}

TemplateToolSystem.systemName = 'TemplateToolSystem'

import { System, Transform } from 'dacha'
import type {
  Scene,
  SystemOptions,
  TemplateConfig,
  ActorConfig,
  ActorSpawner,
  ActorCreator,
} from 'dacha'
import type { MouseControlEvent } from 'dacha/events'

import { EventType } from '../../../events'
import type { SelectLevelEvent, InspectEntityEvent } from '../../../events'
import { ADD } from '../../../command-types'
import { ROOT_SCOPE } from '../../../consts/command-scopes'
import type { CommanderStore } from '../../../store'

import { PreviewSubsystem } from './preview'
import { getTool } from '../../../utils/get-tool'
import { getSavedSelectedLevelId } from '../../../utils/get-saved-selected-level-id'
import { getSavedSelectedEntity } from '../../../utils/get-saved-selected-entity'
import { getActorIdByPath } from '../../../utils/get-actor-id-by-path'

import { createFromTemplate, updatePlacementPosition, isActorPath } from './utils'
import type { Position } from './types'

export class TemplateToolSystem extends System {
  private scene: Scene
  private configStore: CommanderStore
  private actorSpawner: ActorSpawner
  private previewSubsystem: PreviewSubsystem

  private selectedLevelId?: string
  private selectedActorPath?: string[]

  private cursor: Position
  private placementPosition: Position

  constructor(options: SystemOptions) {
    super()

    const {
      scene,
      actorSpawner,
    } = options

    this.scene = scene
    this.configStore = this.scene.data.configStore as CommanderStore
    this.actorSpawner = actorSpawner

    this.previewSubsystem = new PreviewSubsystem({
      scene: this.scene,
      actorCreator: this.scene.data.actorCreator as ActorCreator,
      actorSpawner: this.actorSpawner,
    })

    this.selectedLevelId = getSavedSelectedLevelId(this.configStore)

    const entityPath = getSavedSelectedEntity(this.configStore)
    this.selectedActorPath = isActorPath(entityPath) ? entityPath : undefined

    this.cursor = { x: 0, y: 0 }
    this.placementPosition = { x: 0, y: 0 }
  }

  mount(): void {
    this.scene.addEventListener(EventType.SelectLevel, this.handleSelectLevel)
    this.scene.addEventListener(EventType.InspectedEntityChange, this.handleInspectEntity)
    this.scene.addEventListener(EventType.ToolCursorMove, this.handleToolCursorMove)
    this.scene.addEventListener(EventType.ToolCursorLeave, this.handleToolCursorLeave)
    this.scene.addEventListener(EventType.AddFromTemplate, this.handleAddFromTemplate)

    this.previewSubsystem.mount()
  }

  unmount(): void {
    this.scene.removeEventListener(EventType.SelectLevel, this.handleSelectLevel)
    this.scene.removeEventListener(EventType.InspectedEntityChange, this.handleInspectEntity)
    this.scene.removeEventListener(EventType.ToolCursorMove, this.handleToolCursorMove)
    this.scene.removeEventListener(EventType.ToolCursorLeave, this.handleToolCursorLeave)
    this.scene.removeEventListener(EventType.AddFromTemplate, this.handleAddFromTemplate)

    this.previewSubsystem.unmount()
  }

  private handleSelectLevel = (event: SelectLevelEvent): void => {
    const { levelId } = event
    this.selectedLevelId = levelId
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
    if (this.selectedLevelId === undefined) {
      return
    }

    const { x, y } = event
    this.cursor.x = x
    this.cursor.y = y
    updatePlacementPosition(
      this.cursor,
      this.placementPosition,
      this.configStore,
      this.scene,
    )

    const tool = getTool(this.scene)

    const templateId = tool.features.templateId.value as string | undefined
    const nestToSelected = tool.features.nestToSelected.value as string | undefined

    if (templateId === undefined) {
      return
    }

    const template = this.configStore.get(['templates', `id:${templateId}`]) as TemplateConfig

    let actorOffsetX = this.placementPosition.x ?? 0
    let actorOffsetY = this.placementPosition.y ?? 0

    if (nestToSelected && this.selectedActorPath) {
      const selectedActorId = getActorIdByPath(this.selectedActorPath) as string
      const parentActor = this.scene.getEntityById(selectedActorId)
      const parentTransform = parentActor?.getComponent(Transform)

      actorOffsetX -= parentTransform?.offsetX ?? 0
      actorOffsetY -= parentTransform?.offsetY ?? 0
    }

    const path = nestToSelected && this.selectedActorPath
      ? this.selectedActorPath.concat('children')
      : ['levels', `id:${this.selectedLevelId}`, 'actors']

    const siblings = this.configStore.get(path) as ActorConfig[]

    const actor = createFromTemplate(template, siblings, actorOffsetX, actorOffsetY)

    this.configStore.dispatch({
      command: ADD,
      scope: ROOT_SCOPE,
      options: { path, value: actor },
    })
  }

  update(): void {
    if (this.selectedLevelId === undefined) {
      return
    }

    updatePlacementPosition(
      this.cursor,
      this.placementPosition,
      this.configStore,
      this.scene,
    )

    this.previewSubsystem?.update(this.placementPosition.x, this.placementPosition.y)
  }
}

TemplateToolSystem.systemName = 'TemplateToolSystem'

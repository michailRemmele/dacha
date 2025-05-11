import { SceneSystem, Transform } from 'dacha'
import type {
  World,
  Scene,
  SceneSystemOptions,
  TemplateConfig,
  ActorConfig,
  ActorSpawner,
  ActorCreator,
} from 'dacha'
import type { MouseControlEvent } from 'dacha/events'

import { EventType } from '../../../events'
import type { SelectSceneEvent, InspectEntityEvent } from '../../../events'
import { ADD_VALUE } from '../../../command-types'
import { ROOT_SCOPE } from '../../../consts/scopes'
import type { CommanderStore } from '../../../store'

import { PreviewSubsystem } from './preview'
import { getTool } from '../../../utils/get-tool'
import { getSavedSelectedSceneId } from '../../../utils/get-saved-selected-scene-id'
import { getSavedInspectedEntity } from '../../../utils/get-saved-inspected-entity'
import { getActorIdByPath } from '../../../utils/get-actor-id-by-path'

import { createFromTemplate, updatePlacementPosition, isActorPath } from './utils'
import type { Position } from './types'

export class TemplateToolSystem extends SceneSystem {
  private world: World
  private scene: Scene
  private configStore: CommanderStore
  private actorSpawner: ActorSpawner
  private previewSubsystem: PreviewSubsystem

  private selectedSceneId?: string
  private selectedActorPath?: string[]

  private cursor: Position
  private placementPosition: Position

  constructor(options: SceneSystemOptions) {
    super()

    const {
      world,
      scene,
      actorSpawner,
    } = options

    this.world = world
    this.scene = scene
    this.configStore = this.world.data.configStore as CommanderStore
    this.actorSpawner = actorSpawner

    this.previewSubsystem = new PreviewSubsystem({
      world: this.world,
      actorCreator: this.world.data.actorCreator as ActorCreator,
      actorSpawner: this.actorSpawner,
    })

    this.selectedSceneId = getSavedSelectedSceneId(this.configStore)

    const entityPath = getSavedInspectedEntity(this.configStore)
    this.selectedActorPath = isActorPath(entityPath) ? entityPath : undefined

    this.cursor = { x: 0, y: 0 }
    this.placementPosition = { x: 0, y: 0 }

    this.world.addEventListener(EventType.SelectScene, this.handleSelectScene)
    this.world.addEventListener(EventType.InspectedEntityChange, this.handleInspectEntity)
    this.world.addEventListener(EventType.ToolCursorMove, this.handleToolCursorMove)
    this.world.addEventListener(EventType.ToolCursorLeave, this.handleToolCursorLeave)
    this.world.addEventListener(EventType.AddFromTemplate, this.handleAddFromTemplate)
  }

  onSceneDestroy(): void {
    this.world.removeEventListener(EventType.SelectScene, this.handleSelectScene)
    this.world.removeEventListener(EventType.InspectedEntityChange, this.handleInspectEntity)
    this.world.removeEventListener(EventType.ToolCursorMove, this.handleToolCursorMove)
    this.world.removeEventListener(EventType.ToolCursorLeave, this.handleToolCursorLeave)
    this.world.removeEventListener(EventType.AddFromTemplate, this.handleAddFromTemplate)

    this.previewSubsystem.destroy()
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
    if (this.selectedSceneId === undefined) {
      return
    }

    const { x, y } = event
    this.cursor.x = x
    this.cursor.y = y
    updatePlacementPosition(
      this.cursor,
      this.placementPosition,
      this.configStore,
      this.world,
    )

    const tool = getTool(this.world)

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

  update(): void {
    if (this.selectedSceneId === undefined) {
      return
    }

    updatePlacementPosition(
      this.cursor,
      this.placementPosition,
      this.configStore,
      this.world,
    )

    this.previewSubsystem?.update(this.placementPosition.x, this.placementPosition.y)
  }
}

TemplateToolSystem.systemName = 'TemplateToolSystem'

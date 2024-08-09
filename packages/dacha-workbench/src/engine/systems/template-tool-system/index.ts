import { System } from 'remiz'
import type {
  Scene,
  SystemOptions,
  TemplateConfig,
  LevelConfig,
  ActorSpawner,
  ActorCreator,
} from 'remiz'
import type { MouseControlEvent } from 'remiz/events'

import { persistentStorage } from '../../../persistent-storage'
import { EventType } from '../../../events'
import type { SelectLevelEvent } from '../../../events'
import { ADD } from '../../../command-types'
import { ROOT_SCOPE } from '../../../consts/command-scopes'
import type { Store } from '../../../store'

import { PreviewSubsystem } from './preview'
import { createFromTemplate, updatePlacementPosition } from './utils'
import { getTool } from '../../../utils/get-tool'
import type { Position } from './types'

export class TemplateToolSystem extends System {
  private scene: Scene
  private configStore: Store
  private actorSpawner: ActorSpawner
  private previewSubsystem: PreviewSubsystem

  private selectedLevelId?: string

  private cursor: Position
  private placementPosition: Position

  constructor(options: SystemOptions) {
    super()

    const {
      scene,
      actorSpawner,
    } = options

    this.scene = scene
    this.configStore = this.scene.data.configStore as Store
    this.actorSpawner = actorSpawner

    this.previewSubsystem = new PreviewSubsystem({
      scene: this.scene,
      actorCreator: this.scene.data.actorCreator as ActorCreator,
      actorSpawner: this.actorSpawner,
    })

    this.selectedLevelId = persistentStorage.get('selectedLevel')

    this.cursor = { x: 0, y: 0 }
    this.placementPosition = { x: 0, y: 0 }
  }

  mount(): void {
    this.scene.addEventListener(EventType.SelectLevel, this.handleSelectLevel)
    this.scene.addEventListener(EventType.ToolCursorMove, this.handleToolCursorMove)
    this.scene.addEventListener(EventType.ToolCursorLeave, this.handleToolCursorLeave)
    this.scene.addEventListener(EventType.AddFromTemplate, this.handleAddFromTemplate)

    this.previewSubsystem.mount()
  }

  unmount(): void {
    this.scene.removeEventListener(EventType.SelectLevel, this.handleSelectLevel)
    this.scene.removeEventListener(EventType.ToolCursorMove, this.handleToolCursorMove)
    this.scene.removeEventListener(EventType.ToolCursorLeave, this.handleToolCursorLeave)
    this.scene.removeEventListener(EventType.AddFromTemplate, this.handleAddFromTemplate)

    this.previewSubsystem.unmount()
  }

  private handleSelectLevel = (event: SelectLevelEvent): void => {
    const { levelId } = event
    this.selectedLevelId = levelId
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
    if (templateId === undefined) {
      return
    }

    const template = this.configStore.get(['templates', `id:${templateId}`]) as TemplateConfig
    const level = this.configStore.get(['levels', `id:${this.selectedLevelId}`]) as LevelConfig

    const actor = createFromTemplate(
      template,
      level,
      this.placementPosition.x || 0,
      this.placementPosition.y || 0,
    )

    this.scene.dispatchEvent(EventType.Command, {
      command: ADD,
      scope: ROOT_SCOPE,
      options: {
        path: ['levels', `id:${this.selectedLevelId}`, 'actors'],
        value: actor,
      },
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

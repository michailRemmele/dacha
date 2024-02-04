import { System } from 'remiz'
import type {
  Scene,
  SystemOptions,
  TemplateConfig,
  LevelConfig,
  GameObject,
  GameObjectSpawner,
  GameObjectCreator,
  MouseControlEvent,
} from 'remiz'

import { EventType } from '../../../events'
import type { SelectLevelEvent } from '../../../events'
import { ADD } from '../../../command-types'
import { ROOT_SCOPE } from '../../../consts/command-scopes'
import type { Store } from '../../../store'

import { PreviewSubsystem } from './preview'
import { createFromTemplate, updatePlacementPosition } from './utils'
import { getTool, getTemplateToolObject } from '../../../utils/get-tool'
import type { Position } from './types'

export class TemplateToolSystem extends System {
  private scene: Scene
  private configStore: Store
  private mainObject: GameObject
  private templateToolObject: GameObject
  private gameObjectSpawner: GameObjectSpawner
  private previewSubsystem: PreviewSubsystem

  private selectedLevelId?: string

  private cursor: Position
  private placementPosition: Position

  constructor(options: SystemOptions) {
    super()

    const {
      scene,
      gameObjectSpawner,
    } = options

    this.scene = scene
    this.configStore = this.scene.data.configStore as Store
    this.mainObject = this.scene.data.mainObject as GameObject
    this.templateToolObject = getTemplateToolObject(scene)
    this.gameObjectSpawner = gameObjectSpawner

    this.previewSubsystem = new PreviewSubsystem({
      scene: this.scene,
      gameObjectCreator: this.scene.data.gameObjectCreator as GameObjectCreator,
      gameObjectSpawner: this.gameObjectSpawner,
    })

    this.cursor = { x: 0, y: 0 }
    this.placementPosition = { x: 0, y: 0 }
  }

  mount(): void {
    this.scene.addEventListener(EventType.SelectLevel, this.handleSelectLevel)
    this.mainObject.addEventListener(EventType.ToolCursorMove, this.handleToolCursorMove)
    this.mainObject.addEventListener(EventType.ToolCursorLeave, this.handleToolCursorLeave)
    this.templateToolObject.addEventListener(EventType.AddFromTemplate, this.handleAddFromTemplate)

    this.previewSubsystem.mount()
  }

  unmount(): void {
    this.scene.removeEventListener(EventType.SelectLevel, this.handleSelectLevel)
    this.mainObject.removeEventListener(EventType.ToolCursorMove, this.handleToolCursorMove)
    this.mainObject.removeEventListener(EventType.ToolCursorLeave, this.handleToolCursorLeave)
    this.templateToolObject.removeEventListener(
      EventType.AddFromTemplate,
      this.handleAddFromTemplate,
    )

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

    const gameObject = createFromTemplate(
      template,
      level,
      this.placementPosition.x || 0,
      this.placementPosition.y || 0,
    )

    this.scene.emit(EventType.Command, {
      command: ADD,
      scope: ROOT_SCOPE,
      options: {
        path: ['levels', `id:${this.selectedLevelId}`, 'gameObjects'],
        value: gameObject,
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

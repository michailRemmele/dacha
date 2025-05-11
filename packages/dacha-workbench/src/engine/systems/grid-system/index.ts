import {
  SceneSystem,
  Transform,
  Camera,
} from 'dacha'
import type {
  World,
  SceneSystemOptions,
  Actor,
} from 'dacha'

import { EventType } from '../../../events'
import type { SelectSceneEvent } from '../../../events'
import { GRID_ROOT } from '../../../consts/root-nodes'
import { Settings } from '../../components'
import type { CommanderStore } from '../../../store'
import { getSavedSelectedSceneId } from '../../../utils/get-saved-selected-scene-id'

export class GridSystem extends SceneSystem {
  private world: World
  private configStore: CommanderStore

  private mainActor: Actor
  private selectedSceneId?: string
  private gridNode: HTMLDivElement

  private showGrid: boolean

  constructor(options: SceneSystemOptions) {
    super()

    const { world } = options

    this.world = world
    this.configStore = world.data.configStore as CommanderStore
    this.mainActor = world.data.mainActor as Actor
    this.gridNode = document.getElementById(GRID_ROOT) as HTMLDivElement

    this.selectedSceneId = getSavedSelectedSceneId(this.configStore)

    this.showGrid = false

    this.world.addEventListener(EventType.SelectScene, this.handleSceneChange)
  }

  onSceneDestroy(): void {
    this.world.removeEventListener(EventType.SelectScene, this.handleSceneChange)
  }

  private handleSceneChange = (event: SelectSceneEvent): void => {
    const { sceneId } = event
    this.selectedSceneId = sceneId
  }

  update(): void {
    const {
      data: { gridStep, showGrid, gridColor },
    } = this.mainActor.getComponent(Settings)

    if (this.selectedSceneId === undefined || !showGrid) {
      if (this.showGrid) {
        this.gridNode.setAttribute('style', '')
        this.showGrid = false
      }
      return
    }

    this.showGrid = true

    const transform = this.mainActor.getComponent(Transform)
    const { zoom } = this.mainActor.getComponent(Camera)

    const offsetX = ((gridStep as number) / 2 - transform.offsetX) * zoom
    const offsetY = ((gridStep as number) / 2 - transform.offsetY) * zoom

    const scale = (gridStep as number) * zoom

    this.gridNode.style.backgroundImage = `
      repeating-linear-gradient(${gridColor as string} 0 1px, transparent 1px 100%),
      repeating-linear-gradient(90deg, ${gridColor as string} 0 1px, transparent 1px 100%)
    `
    this.gridNode.style.backgroundSize = `${scale}px ${scale}px`
    this.gridNode.style.backgroundPosition = `calc(50% + ${offsetX}px) calc(50% + ${offsetY}px)`
  }
}

GridSystem.systemName = 'GridSystem'

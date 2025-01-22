import {
  System,
  Transform,
  Camera,
} from 'dacha'
import type {
  Scene,
  SystemOptions,
  Actor,
} from 'dacha'

import { EventType } from '../../../events'
import type { SelectLevelEvent } from '../../../events'
import { GRID_ROOT } from '../../../consts/root-nodes'
import { Settings } from '../../components'
import type { CommanderStore } from '../../../store'
import { getSavedSelectedLevelId } from '../../../utils/get-saved-selected-level-id'

export class GridSystem extends System {
  private scene: Scene
  private configStore: CommanderStore

  private mainActor: Actor
  private selectedLevelId?: string
  private gridNode: HTMLDivElement

  private showGrid: boolean

  constructor(options: SystemOptions) {
    super()

    const { scene } = options

    this.scene = scene
    this.configStore = scene.data.configStore as CommanderStore
    this.mainActor = scene.data.mainActor as Actor
    this.gridNode = document.getElementById(GRID_ROOT) as HTMLDivElement

    this.selectedLevelId = getSavedSelectedLevelId(this.configStore)

    this.showGrid = false
  }

  mount(): void {
    this.scene.addEventListener(EventType.SelectLevel, this.handleLevelChange)
  }

  unmount(): void {
    this.scene.removeEventListener(EventType.SelectLevel, this.handleLevelChange)
  }

  private handleLevelChange = (event: SelectLevelEvent): void => {
    const { levelId } = event
    this.selectedLevelId = levelId
  }

  update(): void {
    const {
      data: { gridStep, showGrid, gridColor },
    } = this.mainActor.getComponent(Settings)

    if (this.selectedLevelId === undefined || !showGrid) {
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

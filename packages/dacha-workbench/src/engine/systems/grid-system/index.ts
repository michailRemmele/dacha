import {
  System,
  Transform,
  Camera,
} from 'remiz'
import type {
  SystemOptions,
  MessageBus,
  GameObject,
} from 'remiz'

import { GRID_ROOT } from '../../../consts/root-nodes'
import { SELECT_LEVEL_MSG } from '../../../consts/message-types'
import { Settings } from '../../components'
import type { SelectLevelMessage } from '../../../types/messages'

export class GridSystem extends System {
  private messageBus: MessageBus

  private mainObject: GameObject
  private selectedLevelId?: string
  private gridNode: HTMLDivElement

  private showGrid: boolean

  constructor(options: SystemOptions) {
    super()

    const {
      messageBus,
      sceneContext,
    } = options

    this.messageBus = messageBus
    this.mainObject = sceneContext.data.mainObject as GameObject
    this.gridNode = document.getElementById(GRID_ROOT) as HTMLDivElement

    this.showGrid = false
  }

  private handleLevelChange(): void {
    const messages = this.messageBus.get(SELECT_LEVEL_MSG) as Array<SelectLevelMessage> | undefined
    if (!messages) {
      return
    }

    const { levelId } = messages[0]

    this.selectedLevelId = levelId
  }

  update(): void {
    this.handleLevelChange()

    const {
      data: { gridStep, showGrid, gridColor },
    } = this.mainObject.getComponent(Settings)

    if (this.selectedLevelId === undefined || !showGrid) {
      if (this.showGrid) {
        this.gridNode.setAttribute('style', '')
        this.showGrid = false
      }
      return
    }

    this.showGrid = true

    const transform = this.mainObject.getComponent(Transform)
    const { zoom } = this.mainObject.getComponent(Camera)

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

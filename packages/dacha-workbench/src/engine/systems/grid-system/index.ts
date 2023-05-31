import {
  System,
  SystemOptions,
  MessageBus,
  GameObject,
  Transform,
  Camera,
} from 'remiz'

import { GRID_ROOT } from '../../../consts/root-nodes'
import { SELECT_LEVEL_MSG } from '../../../consts/message-types'
import type { SelectLevelMessage } from '../../../types/messages'
import type { Settings } from '../../components'

const TRANSFORM_COMPONENT_NAME = 'transform'
const CAMERA_COMPONENT_NAME = 'camera'
const SETTINGS_COMPONENT_NAME = 'settings'

export class GridSystem implements System {
  private messageBus: MessageBus

  private mainObject: GameObject
  private selectedLevelId?: string
  private gridNode: HTMLDivElement

  private showGrid: boolean

  constructor(options: SystemOptions) {
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
    } = this.mainObject.getComponent(SETTINGS_COMPONENT_NAME) as Settings

    if (this.selectedLevelId === undefined || !showGrid) {
      if (this.showGrid) {
        this.gridNode.setAttribute('style', '')
        this.showGrid = false
      }
      return
    }

    this.showGrid = true

    const transform = this.mainObject.getComponent(TRANSFORM_COMPONENT_NAME) as Transform
    const { zoom } = this.mainObject.getComponent(CAMERA_COMPONENT_NAME) as Camera

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

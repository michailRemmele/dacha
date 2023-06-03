import {
  System,
  SystemOptions,
  GameObject,
  MessageBus,
  Camera,
  SceneContext,
} from 'remiz'

import { CAMERA_ZOOM_MSG, SELECT_LEVEL_MSG } from '../../../consts/message-types'
import { getTool } from '../../../utils/get-tool'
import type { SelectLevelMessage } from '../../../types/messages'

const CAMERA_COMPONENT_NAME = 'camera'
const ZOOM_FACTOR = 1.5
const DEFAULT_ZOOM = 1

type ZoomMode = 'in' | 'out'

export class ZoomToolSystem implements System {
  private messageBus: MessageBus
  private sceneContext: SceneContext
  private mainObject: GameObject

  constructor(options: SystemOptions) {
    const {
      messageBus,
      sceneContext,
    } = options

    this.messageBus = messageBus
    this.sceneContext = sceneContext

    this.mainObject = sceneContext.data.mainObject as GameObject
  }

  private handleLevelChange(): void {
    const messages = this.messageBus.get(SELECT_LEVEL_MSG) as Array<SelectLevelMessage> | undefined

    if (!messages) {
      return
    }

    const cameraComponent = this.mainObject.getComponent(CAMERA_COMPONENT_NAME) as Camera
    cameraComponent.zoom = DEFAULT_ZOOM
  }

  update(): void {
    this.handleLevelChange()

    const zoomMessages = (this.messageBus.get(CAMERA_ZOOM_MSG) || [])

    if (!zoomMessages.length) {
      return
    }

    const tool = getTool(this.sceneContext)
    const zoomMode = tool.features.direction.value as ZoomMode

    const cameraComponent = this.mainObject.getComponent(CAMERA_COMPONENT_NAME) as Camera

    if (zoomMode === 'in') {
      cameraComponent.zoom *= ZOOM_FACTOR
    } else {
      cameraComponent.zoom /= ZOOM_FACTOR
    }
  }
}

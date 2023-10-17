import {
  System,
  Camera,
  Transform,
} from 'remiz'
import type {
  SystemOptions,
  GameObject,
  MessageBus,
  SceneContext,
} from 'remiz'

import { CAMERA_ZOOM_MSG, SELECT_LEVEL_MSG } from '../../../consts/message-types'
import { getTool } from '../../../utils/get-tool'
import type { SelectLevelMessage, MouseInputMessage } from '../../../types/messages'

const ZOOM_FACTOR = 1.5
const DEFAULT_ZOOM = 1

type ZoomMode = 'in' | 'out'

export class ZoomToolSystem extends System {
  private messageBus: MessageBus
  private sceneContext: SceneContext
  private mainObject: GameObject

  constructor(options: SystemOptions) {
    super()

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

    const cameraComponent = this.mainObject.getComponent(Camera)
    cameraComponent.zoom = DEFAULT_ZOOM
  }

  update(): void {
    this.handleLevelChange()

    const zoomMessages = (this.messageBus.get(CAMERA_ZOOM_MSG) || [])

    if (!zoomMessages.length) {
      return
    }

    const {
      x,
      y,
      screenX,
      screenY,
    } = zoomMessages.at(-1) as MouseInputMessage

    const tool = getTool(this.sceneContext)
    const zoomMode = tool.features.direction.value as ZoomMode

    const cameraComponent = this.mainObject.getComponent(Camera)
    const transform = this.mainObject.getComponent(Transform)

    if (zoomMode === 'in') {
      cameraComponent.zoom *= ZOOM_FACTOR
    } else {
      cameraComponent.zoom /= ZOOM_FACTOR
    }

    const {
      windowSizeX,
      windowSizeY,
      zoom,
    } = cameraComponent

    const windowCenterX = windowSizeX / 2
    const windowCenterY = windowSizeY / 2

    const nextX = (screenX - windowCenterX) / zoom + transform.offsetX
    const nextY = (screenY - windowCenterY) / zoom + transform.offsetY

    // Move camera in direction of zoom
    transform.offsetX += x - nextX
    transform.offsetY += y - nextY
  }
}

ZoomToolSystem.systemName = 'ZoomToolSystem'

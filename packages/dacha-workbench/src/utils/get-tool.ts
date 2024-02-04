import type { GameObject, Scene } from 'remiz'

import { Tool, ToolController } from '../engine/components'
import {
  HAND_TOOL,
  ZOOM_TOOL,
  POINTER_TOOL,
  TEMPLATE_TOOL,
} from '../consts/tools'

export const getTool = (scene: Scene): Tool => {
  const mainObject = scene.data.mainObject as GameObject

  const toolController = mainObject.getComponent(ToolController)
  const toolObject = mainObject.getChildById(toolController.activeTool) as GameObject

  return toolObject.getComponent(Tool)
}

const getToolObject = (scene: Scene, name: string): GameObject => {
  const mainObject = scene.data.mainObject as GameObject
  return mainObject.getChildById(name) as GameObject
}

export const getHandToolObject = (scene: Scene): GameObject => getToolObject(
  scene,
  HAND_TOOL,
)

export const getZoomToolObject = (scene: Scene): GameObject => getToolObject(
  scene,
  ZOOM_TOOL,
)

export const getPointerToolObject = (scene: Scene): GameObject => getToolObject(
  scene,
  POINTER_TOOL,
)

export const getTemplateToolObject = (scene: Scene): GameObject => getToolObject(
  scene,
  TEMPLATE_TOOL,
)

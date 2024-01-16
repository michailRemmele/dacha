import {
  SceneContext,
  GameObject,
} from 'remiz'

import { Tool, ToolController } from '../engine/components'
import {
  HAND_TOOL,
  ZOOM_TOOL,
  POINTER_TOOL,
  TEMPLATE_TOOL,
} from '../consts/tools'

export const getTool = (sceneContext: SceneContext): Tool => {
  const mainObject = sceneContext.data.mainObject as GameObject

  const toolController = mainObject.getComponent(ToolController)
  const toolObject = mainObject.getChildById(toolController.activeTool) as GameObject

  return toolObject.getComponent(Tool)
}

const getToolObject = (sceneContext: SceneContext, name: string): GameObject => {
  const mainObject = sceneContext.data.mainObject as GameObject
  return mainObject.getChildById(name) as GameObject
}

export const getHandToolObject = (sceneContext: SceneContext): GameObject => getToolObject(
  sceneContext,
  HAND_TOOL,
)

export const getZoomToolObject = (sceneContext: SceneContext): GameObject => getToolObject(
  sceneContext,
  ZOOM_TOOL,
)

export const getPointerToolObject = (sceneContext: SceneContext): GameObject => getToolObject(
  sceneContext,
  POINTER_TOOL,
)

export const getTemplateToolObject = (sceneContext: SceneContext): GameObject => getToolObject(
  sceneContext,
  TEMPLATE_TOOL,
)

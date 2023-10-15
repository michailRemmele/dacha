import type {
  SceneContext,
  GameObject,
} from 'remiz'

import { Tool, ToolController } from '../engine/components'

export const getTool = (sceneContext: SceneContext): Tool => {
  const mainObject = sceneContext.data.mainObject as GameObject

  const toolController = mainObject.getComponent(ToolController)
  const toolObject = mainObject.getChildById(toolController.activeTool) as GameObject

  return toolObject.getComponent(Tool)
}

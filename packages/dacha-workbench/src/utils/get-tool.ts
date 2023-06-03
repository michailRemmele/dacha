import type {
  SceneContext,
  GameObject,
} from 'remiz'

import type { Tool } from '../engine/components'

export const TOOL_COMPONENT_NAME = 'tool'

export const getTool = (sceneContext: SceneContext): Tool => {
  const toolObjectId = sceneContext.data.currentToolObjectId as string
  const mainObject = sceneContext.data.mainObject as GameObject

  const toolObject = mainObject.getChildById(toolObjectId) as GameObject

  return toolObject.getComponent(TOOL_COMPONENT_NAME) as Tool
}

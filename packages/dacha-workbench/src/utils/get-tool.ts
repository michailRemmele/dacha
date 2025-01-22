import type { Actor, Scene } from 'dacha'

import { Tool, ToolController } from '../engine/components'

export const getTool = (scene: Scene): Tool => {
  const mainActor = scene.data.mainActor as Actor

  const toolController = mainActor.getComponent(ToolController)
  const toolActor = mainActor.getEntityById(toolController.activeTool) as Actor

  return toolActor.getComponent(Tool)
}

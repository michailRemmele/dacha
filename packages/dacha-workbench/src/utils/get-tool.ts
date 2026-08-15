import type { Actor, World } from 'dacha'

import { Tool, ToolController } from '../engine/components'

export const getTool = (world: World): Tool => {
  const mainActor = world.data.mainActor as Actor

  const toolController = mainActor.getComponent(ToolController)
  const toolActor = mainActor.findChildById(toolController.activeTool) as Actor

  return toolActor.getComponent(Tool)
}

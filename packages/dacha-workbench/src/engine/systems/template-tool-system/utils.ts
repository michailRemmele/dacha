import {
  Transform,
  RendererService,
} from 'dacha'
import type {
  ActorConfig,
  TemplateConfig,
  World,
  Actor,
} from 'dacha'
import { v4 as uuidv4 } from 'uuid'

import {
  getGridValue,
  getGridStep,
} from '../../../utils/grid'
import { getTool } from '../../../utils/get-tool'
import { getUniqueName } from '../../../utils/get-unique-name'

import { TOOL_NAME, SCENE_PATH_LEGTH } from './consts'
import type { Position } from './types'

const buildActor = (template: TemplateConfig, actors?: ActorConfig[]): ActorConfig => ({
  id: uuidv4(),
  templateId: template.id,
  name: actors ? getUniqueName(template.name, actors) : template.name,
  components: [],
  children: (template.children ?? []).map((child) => buildActor(child)),
})

export const createFromTemplate = (
  template: TemplateConfig,
  actors: ActorConfig[],
  x: number,
  y: number,
): ActorConfig => {
  const templateCopy = structuredClone(template)
  const actor = buildActor(templateCopy, actors)

  const transform = templateCopy.components
    ?.find((component) => component.name === Transform.componentName)

  if (transform !== undefined) {
    transform.config.offsetX = x
    transform.config.offsetY = y

    actor.components?.push(transform)
  }

  return actor
}

export const updatePreviewPosition = (
  cursor: Position,
  world: World,
  preview?: Actor,
): void => {
  if (cursor.x === null || cursor.y === null) {
    return
  }

  const tool = getTool(world)
  const gridStep = getGridStep(world)

  if (tool.name !== TOOL_NAME) {
    return
  }

  const templateId = tool.features.templateId.value as string | undefined
  const snapToGrid = tool.features.grid.value as boolean
  if (templateId === undefined) {
    return
  }

  const transform = preview?.getComponent(Transform)

  if (!preview || !transform) {
    return
  }

  if (!snapToGrid) {
    transform.offsetX = Math.round(cursor.x)
    transform.offsetY = Math.round(cursor.y)
    return
  }

  const rendererService = world.getService(RendererService)
  const bounds = rendererService.getBounds(preview)

  transform.offsetX = getGridValue(cursor.x, bounds.width, gridStep)
  transform.offsetY = getGridValue(cursor.y, bounds.height, gridStep)
}

export const isActorPath = (
  path?: string[],
): boolean => path !== undefined && path[0] === 'scenes' && path.length > SCENE_PATH_LEGTH

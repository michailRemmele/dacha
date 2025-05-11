import {
  Transform,
  Sprite,
} from 'dacha'
import type {
  ActorConfig,
  TemplateConfig,
  World,
  ComponentConfig,
} from 'dacha'
import { v4 as uuidv4 } from 'uuid'

import {
  getGridValue,
  getGridStep,
} from '../../../utils/grid'
import { getTool } from '../../../utils/get-tool'
import { getUniqueName } from '../../../utils/get-unique-name'
import type { CommanderStore } from '../../../store'

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

const getSizeX = (transform: ComponentConfig, sprite?: ComponentConfig): number => {
  const scaleX = (transform.config.scaleX as number | undefined) || 1
  const width = (sprite?.config.width as number | undefined) || 0

  return scaleX * width
}
const getSizeY = (transform: ComponentConfig, sprite?: ComponentConfig): number => {
  const scaleY = (transform.config.scaleY as number | undefined) || 1
  const height = (sprite?.config.height as number | undefined) || 0

  return scaleY * height
}

export const updatePlacementPosition = (
  cursor: Position,
  placementPosition: Position,
  store: CommanderStore,
  world: World,
): void => {
  if (cursor.x === null || cursor.y === null) {
    // eslint-disable-next-line no-param-reassign
    placementPosition.x = null
    // eslint-disable-next-line no-param-reassign
    placementPosition.y = null
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

  if (!snapToGrid) {
    // eslint-disable-next-line no-param-reassign
    placementPosition.x = Math.round(cursor.x)
    // eslint-disable-next-line no-param-reassign
    placementPosition.y = Math.round(cursor.y)
    return
  }

  const template = store.get(['templates', `id:${templateId}`]) as TemplateConfig

  const transform = template.components
    ?.find((component) => component.name === Transform.componentName)
  const sprite = template.components
    ?.find((component) => component.name === Sprite.componentName)

  if (transform !== undefined) {
    // eslint-disable-next-line no-param-reassign
    placementPosition.x = getGridValue(cursor.x, getSizeX(transform, sprite), gridStep)
    // eslint-disable-next-line no-param-reassign
    placementPosition.y = getGridValue(cursor.y, getSizeY(transform, sprite), gridStep)
  }
}

export const isActorPath = (
  path?: string[],
): boolean => path !== undefined && path[0] === 'scenes' && path.length > SCENE_PATH_LEGTH

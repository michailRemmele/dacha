import type {
  GameObjectConfig,
  TemplateConfig,
  LevelConfig,
  SceneContext,
  GameObject,
  ComponentConfig,
} from 'remiz'
import { v4 as uuidv4 } from 'uuid'

import { getGridValue } from '../../../utils/get-grid-value'
import type { Tool } from '../../components'
import type { Store } from '../../../store'

import {
  TOOL_NAME,
  TOOL_COMPONENT_NAME,
  TRANSFORM_COMPONENT_NAME,
  RENDERABLE_COMPONENT_NAME,
} from './consts'
import type { Position } from './types'

const buildGameObject = (template: TemplateConfig, index?: number): GameObjectConfig => ({
  id: uuidv4(),
  templateId: template.id,
  fromTemplate: true,
  name: index ? `${template.name} ${index}` : template.name,
  type: template.type,
  components: [],
  children: (template.children ?? []).map((child) => buildGameObject(child)),
})

export const createFromTemplate = (
  template: TemplateConfig,
  level: LevelConfig,
  x: number,
  y: number,
): GameObjectConfig => {
  const templateCopy = structuredClone(template)

  const { gameObjects } = level
  const sameTemplateObjects = gameObjects
    .filter((gameObject) => gameObject.templateId === template.id)

  const gameObject = buildGameObject(templateCopy, sameTemplateObjects.length)

  const transform = templateCopy.components
    ?.find((component) => component.name === TRANSFORM_COMPONENT_NAME)

  if (transform !== undefined) {
    transform.config.offsetX = x
    transform.config.offsetY = y

    gameObject.components?.push(transform)
  }

  return gameObject
}

export const getTool = (sceneContext: SceneContext): Tool => {
  const toolObjectId = sceneContext.data.currentToolObjectId as string
  const mainObject = sceneContext.data.mainObject as GameObject

  const toolObject = mainObject.getChildById(toolObjectId) as GameObject

  return toolObject.getComponent(TOOL_COMPONENT_NAME) as Tool
}

const getSizeX = (transform: ComponentConfig, renderable?: ComponentConfig): number => {
  const scaleX = (transform.config.scaleX as number | undefined) || 1
  const width = (renderable?.config.width as number | undefined) || 0

  return scaleX * width
}
const getSizeY = (transform: ComponentConfig, renderable?: ComponentConfig): number => {
  const scaleY = (transform.config.scaleY as number | undefined) || 1
  const height = (renderable?.config.height as number | undefined) || 0

  return scaleY * height
}

export const updateGridPosition = (
  cursor: Position,
  gridPosition: Position,
  store: Store,
  tool: Tool,
): void => {
  if (cursor.x === null || cursor.y === null) {
    // eslint-disable-next-line no-param-reassign
    gridPosition.x = null
    // eslint-disable-next-line no-param-reassign
    gridPosition.y = null
    return
  }

  if (tool.name !== TOOL_NAME) {
    return
  }

  const templateId = tool.features.templateId.value as string | undefined
  const step = tool.features.step.value as number
  if (templateId === undefined) {
    return
  }

  const template = store.get(['templates', `id:${templateId}`]) as TemplateConfig

  const transform = template.components
    ?.find((component) => component.name === TRANSFORM_COMPONENT_NAME)
  const renderable = template.components
    ?.find((component) => component.name === RENDERABLE_COMPONENT_NAME)

  if (transform !== undefined) {
    // eslint-disable-next-line no-param-reassign
    gridPosition.x = getGridValue(cursor.x, getSizeX(transform, renderable), step)
    // eslint-disable-next-line no-param-reassign
    gridPosition.y = getGridValue(cursor.y, getSizeY(transform, renderable), step)
  }
}

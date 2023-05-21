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

import {
  TOOL_COMPONENT_NAME,
  TRANSFORM_COMPONENT_NAME,
  RENDERABLE_COMPONENT_NAME,
} from './consts'

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
  step: number,
): GameObjectConfig => {
  const templateCopy = structuredClone(template)

  const { gameObjects } = level
  const sameTemplateObjects = gameObjects
    .filter((gameObject) => gameObject.templateId === template.id)

  const gameObject = buildGameObject(templateCopy, sameTemplateObjects.length)

  const transform = templateCopy.components
    ?.find((component) => component.name === TRANSFORM_COMPONENT_NAME)
  const renderable = templateCopy.components
    ?.find((component) => component.name === RENDERABLE_COMPONENT_NAME)

  if (transform !== undefined) {
    transform.config.offsetX = getGridValue(x, getSizeX(transform, renderable), step)
    transform.config.offsetY = getGridValue(y, getSizeY(transform, renderable), step)

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

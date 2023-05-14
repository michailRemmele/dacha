import type {
  GameObjectConfig,
  TemplateConfig,
  LevelConfig,
} from 'remiz'
import { v4 as uuidv4 } from 'uuid'

const TRANSFORM_COMPONENT_NAME = 'transform'

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

  const transform = templateCopy.components?.find(
    (component) => component.name === TRANSFORM_COMPONENT_NAME,
  )

  if (transform !== undefined) {
    transform.config.offsetX = Math.round(x)
    transform.config.offsetY = Math.round(y)

    gameObject.components?.push(transform)
  }

  return gameObject
}

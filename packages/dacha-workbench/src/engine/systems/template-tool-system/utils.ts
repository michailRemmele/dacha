import type {
  GameObjectConfig,
  TemplateConfig,
  LevelConfig,
} from 'remiz'
import { v4 as uuidv4 } from 'uuid'

const buildGameObject = (template: TemplateConfig, index?: number): GameObjectConfig => ({
  id: uuidv4(),
  templateId: template.id,
  fromTemplate: true,
  name: index ? `${template.name} ${index}` : template.name,
  type: template.type,
  components: template.components,
  children: (template.children ?? []).map((child) => buildGameObject(child)),
})

export const createFromTemplate = (
  template: TemplateConfig,
  level: LevelConfig,
): GameObjectConfig => {
  const { gameObjects } = level
  const sameTemplateObjects = gameObjects
    .filter((gameObject) => gameObject.templateId === template.id)

  return buildGameObject(structuredClone(template), sameTemplateObjects.length)
}

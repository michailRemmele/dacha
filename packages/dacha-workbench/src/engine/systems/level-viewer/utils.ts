import type { GameObjectConfig, TemplateConfig } from 'remiz'

const TRANSFORM_COMPONENT_NAME = 'transform'
const RENDERABLE_COMPONENT_NAME = 'renderable'
const LIGHT_COMPONENT_NAME = 'light'

const ALLOWED_COMPONENTS = new Set([
  TRANSFORM_COMPONENT_NAME,
  RENDERABLE_COMPONENT_NAME,
  LIGHT_COMPONENT_NAME,
])

/**
 * Leaves only necessary components to display object in level viewer
 */
export const omit = <T extends GameObjectConfig | TemplateConfig>(entity: T): T => ({
  ...entity,
  children: entity.children?.map(omit),
  components: entity.components?.filter((component) => ALLOWED_COMPONENTS.has(component.name)),
})

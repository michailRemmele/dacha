import type { GameObjectConfig, TemplateConfig } from 'remiz'

import { ALLOWED_COMPONENTS } from './consts'

const ALLOWED_COMPONENT_NAMES = new Set(ALLOWED_COMPONENTS.map((entry) => entry.componentName))

/**
 * Leaves only necessary components to display object in level viewer
 */
export const omit = <T extends GameObjectConfig | TemplateConfig>(entity: T): T => ({
  ...entity,
  children: entity.children?.map(omit),
  components: entity.components?.filter((component) => ALLOWED_COMPONENT_NAMES.has(component.name)),
})

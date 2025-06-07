import { schemaRegistry } from '../../modules/inspector/schema-registry'
import type { WidgetSchema } from '../../../types/widget-schema'

export const useBehaviors = (systemName?: string): Record<string, WidgetSchema> | undefined => {
  const schemas = schemaRegistry.getGroup(systemName ? `behavior.${systemName}` : 'behavior')

  return schemas
}

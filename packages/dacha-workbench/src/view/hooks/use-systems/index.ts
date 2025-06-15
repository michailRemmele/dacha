import { schemaRegistry } from '../../../decorators/schema-registry'
import type { WidgetSchema } from '../../../types/widget-schema'

export const useSystems = (): Record<string, WidgetSchema> | undefined => {
  const schemas = schemaRegistry.getGroup('system')

  return schemas
}

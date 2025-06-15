import { schemaRegistry } from '../../../decorators/schema-registry'
import type { WidgetSchema } from '../../../types/widget-schema'

export const useComponents = (): Record<string, WidgetSchema> | undefined => {
  const schemas = schemaRegistry.getGroup('component')

  return schemas
}

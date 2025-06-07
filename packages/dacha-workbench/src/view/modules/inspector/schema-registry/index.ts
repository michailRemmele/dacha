import type { WidgetSchema } from '../../../../types/widget-schema'

class SchemaRegistry {
  private registry: Map<string, Map<string, WidgetSchema>>

  constructor() {
    this.registry = new Map()
  }

  addWidget(
    groupName: string,
    widgetName: string,
    widget: WidgetSchema,
  ): void {
    if (!this.registry.has(groupName)) {
      this.registry.set(groupName, new Map())
    }

    const group = this.registry.get(groupName)
    group?.set(widgetName, widget)
  }

  getWidget(groupName: string, widgetName: string): WidgetSchema | undefined {
    return this.registry.get(groupName)?.get(widgetName)
  }

  getGroup(groupName: string): Record<string, WidgetSchema> | undefined {
    return this.registry.has(groupName)
      ? Object.fromEntries(this.registry.get(groupName)!)
      : undefined
  }
}

export const schemaRegistry = new SchemaRegistry()

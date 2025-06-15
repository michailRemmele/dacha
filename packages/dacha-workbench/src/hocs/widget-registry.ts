import type { FC } from 'react'

import type { WidgetProps } from '../types/widget-schema'

class WidgetRegistry {
  private registry: Map<string, FC<WidgetProps>>

  constructor() {
    this.registry = new Map()
  }

  addWidget(
    name: string,
    component: FC<WidgetProps>,
  ): void {
    this.registry.set(name, component)
  }

  getWidget(name: string): FC<WidgetProps> | undefined {
    return this.registry.get(name)
  }
}

export const widgetRegistry = new WidgetRegistry()

import type { FC } from 'react'

import type { WidgetProps } from '../types/widget-schema'

import { widgetRegistry } from './widget-registry'

export const defineWidget = (
  name: string,
) => <T extends React.ComponentType<WidgetProps>>(Component: T): T => {
  widgetRegistry.addWidget(name, Component as FC<WidgetProps>)
  return Component
}

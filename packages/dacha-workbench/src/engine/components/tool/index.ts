import { Component } from 'dacha'

import { Feature } from './feature'
import type { FeatureValue, FeatureConfig } from './feature'

export type { FeatureValue, FeatureConfig }

export interface ToolConfig extends Record<string, unknown> {
  name: string;
  features: Record<string, FeatureConfig>
  inputBindings: Array<unknown>
}

export class Tool extends Component {
  name: string
  features: Record<string, Feature>
  inputBindings: Array<unknown>

  constructor(config: Record<string, unknown>) {
    super()

    const toolConfig = config as ToolConfig

    this.name = toolConfig.name
    this.features = Object.keys(toolConfig.features)
      .reduce((acc: Record<string, Feature>, name) => {
        acc[name] = new Feature(toolConfig.features[name])
        return acc
      }, {})
    this.inputBindings = toolConfig.inputBindings
  }

  clone(): Tool {
    return new Tool({
      name: this.name,
      features: this.features,
      inputBindings: this.inputBindings,
    })
  }
}

Tool.componentName = 'Tool'

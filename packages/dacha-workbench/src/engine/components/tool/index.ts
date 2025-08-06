import { Component } from 'dacha'

import { Feature } from './feature'
import type { FeatureValue, FeatureConfig } from './feature'

export type { FeatureValue, FeatureConfig }

export interface ToolConfig {
  name: string;
  features: Record<string, FeatureConfig>
  inputBindings: unknown[]
}

export class Tool extends Component {
  name: string
  features: Record<string, Feature>
  inputBindings: unknown[]

  constructor(config: ToolConfig) {
    super()

    this.name = config.name
    this.features = Object.keys(config.features)
      .reduce((acc: Record<string, Feature>, name) => {
        acc[name] = new Feature(config.features[name])
        return acc
      }, {})
    this.inputBindings = config.inputBindings
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

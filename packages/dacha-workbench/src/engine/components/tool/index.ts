import { Component } from 'remiz'

import { Feature, FeatureConfig } from './feature'

interface ToolConfig extends Record<string, unknown> {
  name: string;
  features: Record<string, FeatureConfig>
}

export class Tool extends Component {
  name: string
  features: Record<string, Feature>

  constructor(componentName: string, config: Record<string, unknown>) {
    super(componentName)

    const toolConfig = config as ToolConfig

    this.name = toolConfig.name
    this.features = Object.keys(toolConfig.features)
      .reduce((acc: Record<string, Feature>, name) => {
        acc[name] = new Feature(toolConfig.features[name])
        return acc
      }, {})
  }

  clone(): Tool {
    return new Tool(this.componentName, {
      name: this.name,
      features: this.features,
    })
  }
}

export interface FeatureConfig {
  value: string
  withClassName: boolean
}

export class Feature {
  value: string
  withClassName: boolean

  constructor(config: FeatureConfig) {
    this.value = config.value
    this.withClassName = config.withClassName
  }
}

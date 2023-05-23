export type FeatureValue = string | number | boolean

export interface FeatureConfig {
  value: FeatureValue
  withClassName: boolean
}

export class Feature {
  value: FeatureValue
  withClassName: boolean

  constructor(config: FeatureConfig) {
    this.value = config.value
    this.withClassName = config.withClassName
  }
}

export interface FeatureConfig {
  value: string
}

export class Feature {
  value: string

  constructor(config: FeatureConfig) {
    this.value = config.value
  }
}

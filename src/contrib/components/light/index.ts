import { Component } from '../../../engine/component';

export interface BaseLightOptions {
  color: string
  intensity: number
}

export interface PointLightOptions extends BaseLightOptions {
  distance: number
}

export type LightType = 'ambient' | 'point';
export type LightOptions = BaseLightOptions | PointLightOptions;

export interface LightConfig {
  type: LightType
  options: BaseLightOptions | PointLightOptions
}

export class Light extends Component {
  type: LightType;
  options: BaseLightOptions | PointLightOptions;

  constructor(componentName: string, config: LightConfig) {
    super(componentName);

    this.type = config.type;
    this.options = { ...config.options };
  }

  clone(): Light {
    return new Light(this.componentName, {
      type: this.type,
      options: this.options,
    });
  }
}

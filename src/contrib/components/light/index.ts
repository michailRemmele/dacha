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

  constructor(config: LightConfig) {
    super();

    const lightConfig = config;

    this.type = lightConfig.type;
    this.options = { ...lightConfig.options };
  }

  clone(): Light {
    return new Light({
      type: this.type,
      options: this.options,
    });
  }
}

Light.componentName = 'Light';

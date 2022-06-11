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

export type LightConfig = {
  type: LightType
  options: BaseLightOptions | PointLightOptions
};

export class Light extends Component {
  type: LightType;
  options: BaseLightOptions | PointLightOptions;

  constructor(componentName: string, config: Record<string, unknown>) {
    super(componentName);

    const lightConfig = config as LightConfig;

    this.type = lightConfig.type;
    this.options = { ...lightConfig.options };
  }

  clone(): Light {
    return new Light(this.componentName, {
      type: this.type,
      options: this.options,
    });
  }
}

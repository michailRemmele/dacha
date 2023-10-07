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

export interface LightConfig extends Record<string, unknown> {
  type: LightType
  options: BaseLightOptions | PointLightOptions
}

export class Light extends Component {
  type: LightType;
  options: BaseLightOptions | PointLightOptions;

  constructor(config: Record<string, unknown>) {
    super();

    const lightConfig = config as LightConfig;

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

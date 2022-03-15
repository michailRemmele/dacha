export type BlendingMode = 'normal' | 'addition' | 'substract' | 'multiply';

export interface BasicMaterialOptions {
  color?: string
  blending?: BlendingMode
}

export type MaterialType = 'lightsensitive' | 'basic';

export interface MaterialConfig {
  type: MaterialType;
  options?: BasicMaterialOptions
}

export class Material {
  type: MaterialType;
  options: BasicMaterialOptions;

  constructor(config: MaterialConfig) {
    this.type = config.type;
    this.options = config.options ? { ...config.options } : {};
  }
}

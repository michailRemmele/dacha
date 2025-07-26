export type BlendingMode = 'normal' | 'addition' | 'substract' | 'multiply';

export interface BasicMaterialOptions {
  color: string;
  blending: BlendingMode;
  opacity: number;
}

export type MaterialType = 'lightsensitive' | 'basic';

export interface MaterialConfig {
  type: MaterialType;
  options: Partial<BasicMaterialOptions>;
}

export class Material {
  type: MaterialType;
  options: BasicMaterialOptions;

  constructor(config: MaterialConfig) {
    this.type = config.type;
    this.options = {
      color: config.options.color || '#ffffff',
      blending: config.options.blending || 'normal',
      opacity: config.options.opacity || 1,
    };
  }
}

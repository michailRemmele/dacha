import { Component } from '../../../engine/component';

export interface RenderEffectConfig {
  name: string;
  options: Record<string, unknown>;
}

export interface MaterialConfig {
  effects: RenderEffectConfig[];
  tint: string;
}

export class Material extends Component {
  effects: RenderEffectConfig[];
  tint: string;

  constructor(config: MaterialConfig) {
    super();

    const { effects, tint } = config;

    this.effects = effects;
    this.tint = tint;
  }

  addEffect(name: string, options: Record<string, unknown>): void {
    this.effects = [
      ...this.effects,
      {
        name,
        options,
      },
    ];
  }

  removeEffect(name: string): void {
    this.effects = this.effects.filter((effect) => effect.name !== name);
  }

  clone(): Material {
    return new Material({
      effects: this.effects.map(({ options, ...effects }) => ({
        ...effects,
        options: { ...options },
      })),
      tint: this.tint,
    });
  }
}

Material.componentName = 'Material';

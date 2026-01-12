import type { Filter } from 'pixi.js';

import type { Constructor } from '../../../../types/utils';

export abstract class RenderEffect {
  static behaviorName: string;
  abstract create(options: unknown): Filter;
  update?(filter: Filter, options: unknown, deltaTime: number): void;
}

export type RenderEffectConstructor = Constructor<RenderEffect> & {
  behaviorName: string;
};

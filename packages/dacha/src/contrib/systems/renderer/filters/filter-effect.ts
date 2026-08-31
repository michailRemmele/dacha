import type { Filter } from 'pixi.js';

import type { Constructor } from '../../../../types/utils';

export interface FilterEffectConfig {
  name: string;
  options: Record<string, unknown>;
}

export abstract class FilterEffect {
  static behaviorName: string;
  abstract create(options: unknown): Filter;
  update?(filter: Filter, options: unknown, elapsedTime: number): void;
}

export type FilterEffectConstructor = Constructor<FilterEffect> & {
  behaviorName: string;
};

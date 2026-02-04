import type { Filter } from 'pixi.js';

import type { Constructor } from '../../../../types/utils';

export interface PostEffectConfig {
  name: string;
  options: Record<string, unknown>;
}

export abstract class PostEffect {
  static behaviorName: string;
  abstract create(options: unknown): Filter;
  update?(filter: Filter, elapsedTime: number): void;
}

export type PostEffectConstructor = Constructor<PostEffect> & {
  behaviorName: string;
};

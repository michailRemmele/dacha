import type { Filter, Application } from 'pixi.js';
import uuid from 'uuid-random';

import type { Time } from '../types';

import type {
  PostEffect,
  PostEffectConstructor,
  PostEffectConfig,
} from './post-effect';

export interface FiltersSystemOptions {
  application: Application;
  time: Time;
  availablePostEffects?: PostEffectConstructor[];
  postEffects?: PostEffectConfig[];
}

export class FilterSystem {
  private application: Application;
  private time: Time;
  private effects: Record<string, PostEffect | undefined>;

  private filtersMap: Map<string, Filter>;

  constructor({
    application,
    time,
    availablePostEffects = [],
    postEffects = [],
  }: FiltersSystemOptions) {
    this.application = application;
    this.effects = availablePostEffects.reduce(
      (acc, PostEffect) => {
        if (PostEffect.behaviorName === undefined) {
          throw new Error(
            `Missing behaviorName field for "${PostEffect.name}" PostEffect class.`,
          );
        }

        if (acc[PostEffect.behaviorName] !== undefined) {
          console.warn(
            `PostEffect "${PostEffect.behaviorName}" already exists and will be overridden.`,
          );
        }

        acc[PostEffect.behaviorName] = new PostEffect();
        return acc;
      },
      {} as Record<string, PostEffect>,
    );

    this.time = time;

    this.filtersMap = new Map();

    postEffects.forEach((effect) =>
      this.addEffect(effect.name, effect.options),
    );
  }

  clear(): void {
    this.filtersMap.clear();
    this.application.stage.filters = null;
  }

  addEffect(name: string, options: Record<string, unknown>): string {
    const effect = this.effects[name];
    if (!effect) {
      throw new Error(`Post effect not found: ${name}`);
    }

    const id = uuid();
    const filter = effect.create(options);
    filter.__dacha = { name };

    this.filtersMap.set(id, filter);

    const currentFilters = this.application.stage.filters ?? [];
    this.application.stage.filters = [...currentFilters, filter];

    return id;
  }

  removeEffect(id: string): void {
    const filter = this.filtersMap.get(id);
    if (!filter) {
      return;
    }

    this.filtersMap.delete(id);

    const currentFilters = this.application.stage.filters ?? [];
    const nextFilters = currentFilters.filter((entry) => entry !== filter);
    this.application.stage.filters = nextFilters.length ? nextFilters : null;
  }

  update(): void {
    this.filtersMap.forEach((filter) => {
      const name = filter.__dacha.name;
      this.effects[name]?.update?.(filter, this.time.elapsed);
    });
  }
}

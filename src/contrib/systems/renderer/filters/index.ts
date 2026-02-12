import type { Filter, Application } from 'pixi.js';
import uuid from 'uuid-random';

import type { Time } from '../types';

import type {
  FilterEffect,
  FilterEffectConstructor,
  FilterEffectConfig,
} from './filter-effect';

export interface FiltersSystemOptions {
  application: Application;
  time: Time;
  availableFilterEffects?: FilterEffectConstructor[];
  filterEffects?: FilterEffectConfig[];
}

export class FilterSystem {
  private application: Application;
  private time: Time;
  private effects: Record<string, FilterEffect | undefined>;

  private filtersMap: Map<string, Filter>;

  constructor({
    application,
    time,
    availableFilterEffects = [],
    filterEffects = [],
  }: FiltersSystemOptions) {
    this.application = application;
    this.effects = availableFilterEffects.reduce(
      (acc, FilterEffect) => {
        if (FilterEffect.behaviorName === undefined) {
          throw new Error(
            `Missing behaviorName field for "${FilterEffect.name}" FilterEffect class.`,
          );
        }

        if (acc[FilterEffect.behaviorName] !== undefined) {
          console.warn(
            `FilterEffect "${FilterEffect.behaviorName}" already exists and will be overridden.`,
          );
        }

        acc[FilterEffect.behaviorName] = new FilterEffect();
        return acc;
      },
      {} as Record<string, FilterEffect>,
    );

    this.time = time;

    this.filtersMap = new Map();

    filterEffects.forEach((effect) =>
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
      throw new Error(`Filter effect not found: ${name}`);
    }

    const id = uuid();
    const filter = effect.create(options);
    filter.__dacha = { name, meta: {} };

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

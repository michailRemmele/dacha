import type { Filter, Application } from 'pixi.js';

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

  private filtersMap: Map<FilterEffectConfig, Filter>;

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

    filterEffects.forEach((effect) => this.addEffect(effect));
  }

  clear(): void {
    this.filtersMap.clear();
    this.application.stage.filters = null;
  }

  addEffect(config: FilterEffectConfig): void {
    const effect = this.effects[config.name];
    if (!effect) {
      throw new Error(`Filter effect not found: ${config.name}`);
    }

    const filter = effect.create(config.options);
    filter.__dacha = { meta: { name: config.name } };

    this.filtersMap.set(config, filter);

    const currentFilters = this.application.stage.filters ?? [];
    this.application.stage.filters = [...currentFilters, filter];
  }

  removeEffect(config: FilterEffectConfig): void {
    const filter = this.filtersMap.get(config);
    if (!filter) {
      return;
    }

    this.filtersMap.delete(config);

    const currentFilters = this.application.stage.filters ?? [];
    const nextFilters = currentFilters.filter((entry) => entry !== filter);
    this.application.stage.filters = nextFilters.length ? nextFilters : null;
  }

  getEffects(): FilterEffectConfig[] {
    return Array.from(this.filtersMap.keys());
  }

  update(): void {
    this.filtersMap.forEach((filter, config) => {
      const meta = filter.__dacha.meta;

      if (config.name !== meta.name) {
        this.removeEffect(config);
        this.addEffect(config);
      }
    });

    this.filtersMap.forEach((filter, config) => {
      this.effects[config.name]?.update?.(
        filter,
        config.options,
        this.time.elapsed,
      );
    });
  }
}

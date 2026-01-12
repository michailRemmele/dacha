import type { Filter, ViewContainer } from 'pixi.js';

import { Actor, ActorQuery } from '../../../../engine/actor';
import type { Scene } from '../../../../engine/scene';
import {
  Material,
  type RenderEffectConfig,
} from '../../../components/material';
import {
  RemoveComponent,
  type RemoveComponentEvent,
} from '../../../../engine/events';
import type { ActorRenderTree } from '../actor-render-tree';

import { VIEW_COMPONENTS } from '../consts';
import type { ViewComponent } from '../types';

import { type RenderEffect, type RenderEffectConstructor } from './render-effect';
import { combineFilters } from './utils';

export interface FiltersSystemOptions {
  scene: Scene;
  actorRenderTree: ActorRenderTree;
  resources: unknown;
}

export class FilterSystem {
  private scene: Scene;
  private actorRenderTree: ActorRenderTree;
  private effects: Record<string, RenderEffect | undefined>;

  private query: ActorQuery;
  private activeFilters: Set<Filter>;
  private actorFiltersMap: Map<Actor, Filter[]>;

  constructor({ scene, actorRenderTree, resources }: FiltersSystemOptions) {
    this.scene = scene;
    this.actorRenderTree = actorRenderTree;
    this.effects = (resources as RenderEffectConstructor[]).reduce(
      (acc, RenderEffect) => {
        if (RenderEffect.behaviorName === undefined) {
          throw new Error(
            `Missing behaviorName field for "${RenderEffect.name}" RenderEffect class.`,
          );
        }

        if (acc[RenderEffect.behaviorName] !== undefined) {
          console.warn(
            `RenderEffect "${RenderEffect.behaviorName}" already exists and will be overridden.`,
          );
        }

        acc[RenderEffect.behaviorName] = new RenderEffect();
        return acc;
      },
      {} as Record<string, RenderEffect>,
    );

    this.query = new ActorQuery({ scene, filter: [Material] });
    this.activeFilters = new Set();
    this.actorFiltersMap = new Map();

    this.query.getActors().forEach((actor) => this.updateMaterial(actor));

    this.scene.addEventListener(RemoveComponent, this.handleRemoveComponent);

    this.actorRenderTree.onActorAdd((actor) => {
      if (
        actor.parent instanceof Actor &&
        this.actorFiltersMap.has(actor.parent)
      ) {
        this.syncActor(actor);
      }
    });
    this.actorRenderTree.onActorRemove((actor) => this.clearActor(actor));
    this.actorRenderTree.onActorParentChange((actor) => {
      if (
        this.actorFiltersMap.has(actor) ||
        (actor.parent instanceof Actor &&
          this.actorFiltersMap.has(actor.parent))
      ) {
        this.syncActor(actor);
      }
    });
    this.actorRenderTree.onViewAdd((view) => this.syncView(view));
  }

  destroy(): void {
    this.scene.removeEventListener(RemoveComponent, this.handleRemoveComponent);
  }

  private handleRemoveComponent = (event: RemoveComponentEvent): void => {
    if (event.name !== Material.componentName) {
      return;
    }

    const container = this.actorRenderTree.getContainer(event.target);
    if (!container) {
      return;
    }

    container.tint = 0xffffff;

    this.syncActor(event.target);
  };

  private updateMaterial(actor: Actor): void {
    const container = this.actorRenderTree.getContainer(actor);
    if (!container) {
      return;
    }

    const { tint, effects } = actor.getComponent(Material);

    const meta = container.__dacha.meta;

    if (tint !== meta.tint) {
      container.tint = tint;
      meta.tint = tint;
    }

    if (effects !== meta.effects) {
      this.syncActor(actor);
    }
  }

  clearActor(actor: Actor): void {
    const container = this.actorRenderTree.getContainer(actor)!;

    container.__dacha.ownFilters?.forEach((filter) =>
      this.activeFilters.delete(filter),
    );

    this.actorFiltersMap.delete(actor);

    actor.children.forEach((child) => this.clearActor(child));
  }

  syncActor(actor: Actor): void {
    const parentFilters =
      actor.parent instanceof Actor
        ? this.actorFiltersMap.get(actor.parent)
        : undefined;

    const container = this.actorRenderTree.getContainer(actor)!;

    let ownFilters: Filter[] | undefined;

    const material = actor.getComponent(Material);
    const meta = container.__dacha.meta;

    if (material?.effects !== meta.effects) {
      container.__dacha.ownFilters?.forEach((filter) =>
        this.activeFilters.delete(filter),
      );

      ownFilters = material?.effects
        .filter((config) => {
          if (!this.effects[config.name]) {
            console.warn(`Render effect not found: ${config.name}`);
          }
          return this.effects[config.name];
        })
        .map((config) => {
          const effect = this.effects[config.name]!;
          const filter = effect.create(config.options);
          filter.__dacha = { effect: config };
          this.activeFilters.add(filter);
          return filter;
        });

      meta.effects = material?.effects;
      container.__dacha.ownFilters = ownFilters;
    } else if (material && material.effects === meta.effects) {
      ownFilters = container.__dacha.ownFilters;
    }

    const filters = combineFilters(parentFilters, ownFilters);
    if (filters) {
      this.actorFiltersMap.set(actor, filters);
    } else {
      this.actorFiltersMap.delete(actor);
    }

    VIEW_COMPONENTS.forEach((ViewComponent) => {
      const viewComponent = actor.getComponent(ViewComponent) as ViewComponent;

      if (!viewComponent?.renderData?.view) {
        return;
      }

      viewComponent.renderData.view.filters = filters;
    });

    actor.children.forEach((child) => this.syncActor(child));
  }

  syncView(view: ViewContainer): void {
    const filters = this.actorFiltersMap.get(view.__dacha.actor);
    view.filters = filters;
  }

  update(deltaTime: number): void {
    this.query.getActors().forEach((actor) => this.updateMaterial(actor));

    this.activeFilters.forEach((filter) => {
      const config = filter.__dacha?.effect as RenderEffectConfig | undefined;

      if (config) {
        this.effects[config.name]?.update?.(filter, config.options, deltaTime);
      }
    });
  }
}

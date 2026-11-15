import type { World, WorldListenerFn } from '../../../engine/world';
import type { Scene } from '../../../engine/scene';
import type { Assets } from '../../../engine/asset';
import type { EventType, ListenerFn } from '../../../engine/event-target';
import { ActorQuery } from '../../../engine/actor';
import type { Actor } from '../../../engine/actor';
import type { ComponentConstructor } from '../../../engine/component';

import { Watch } from './watch';
import type { UIValue, UISelectorTools, UIContext } from './types';

interface UIContextHostOptions {
  world: World;
  assets: Assets;
  options: Record<string, unknown>;
}

export class UIContextHost {
  readonly context: UIContext;

  private world: World;
  private scene?: Scene;
  private listeners: Set<{ type: EventType; listener: ListenerFn }>;
  private watches: Set<Watch<unknown>>;
  private queries: Map<string, ActorQuery>;
  private tools: UISelectorTools;

  constructor({ world, assets, options }: UIContextHostOptions) {
    this.world = world;
    this.listeners = new Set();
    this.watches = new Set();
    this.queries = new Map();

    const getScene = (): Scene | undefined => this.scene;

    this.tools = {
      get scene(): Scene | undefined {
        return getScene();
      },
      find: (filter): Actor | undefined => this.find(filter),
      findAll: (filter): Actor[] => this.findAll(filter),
    };

    this.context = {
      world,
      assets,
      options,
      get scene(): Scene | undefined {
        return getScene();
      },
      watch: <T>(
        selector: (tools: UISelectorTools) => T,
        equals?: (a: T, b: T) => boolean,
      ): UIValue<T> => this.watch(selector, equals),
      on: <T extends EventType>(
        type: T,
        listener: WorldListenerFn<T>,
      ): (() => void) => this.on(type, listener),
    };
  }

  setScene(scene: Scene | undefined): void {
    if (scene !== this.scene) {
      this.clearQueries();
    }
    this.scene = scene;
  }

  tick(): void {
    this.watches.forEach((watch) => watch.refresh());
  }

  destroy(): void {
    this.clearQueries();
    this.scene = undefined;
    this.watches.forEach((watch) => watch.clear());
    this.watches.clear();

    this.listeners.forEach(({ type, listener }) =>
      this.world.removeEventListener(type, listener),
    );
    this.listeners.clear();
  }

  private watch<T>(
    selector: (tools: UISelectorTools) => T,
    equals?: (a: T, b: T) => boolean,
  ): UIValue<T> {
    return new Watch(() => selector(this.tools), this.watches, equals);
  }

  private on<T extends EventType>(
    type: T,
    listener: WorldListenerFn<T>,
  ): () => void {
    const entry = { type, listener: listener as ListenerFn };
    this.world.addEventListener(type, listener);
    this.listeners.add(entry);

    return (): void => {
      if (this.listeners.delete(entry)) {
        this.world.removeEventListener(type, listener);
      }
    };
  }

  private find(filter: ComponentConstructor[]): Actor | undefined {
    return this.getQuery(filter)?.getActors().values().next().value;
  }

  private findAll(filter: ComponentConstructor[]): Actor[] {
    return Array.from(this.getQuery(filter)?.getActors() ?? []);
  }

  private getQuery(filter: ComponentConstructor[]): ActorQuery | undefined {
    if (!this.scene) {
      return undefined;
    }
    const key = filter.map((component) => component.componentName).join('|');
    let query = this.queries.get(key);
    if (!query) {
      query = new ActorQuery({ scene: this.scene, filter });
      this.queries.set(key, query);
    }
    return query;
  }

  private clearQueries(): void {
    this.queries.forEach((query) => query.destroy());
    this.queries.clear();
  }
}

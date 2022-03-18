import type { Component } from '../component';

import { Prefab } from './prefab';

export interface ComponentOptions {
  name: string
  config: Record<string, unknown>
}

export interface PrefabOptions {
  name: string
  type: string
  components?: Array<ComponentOptions>
  children?: Array<PrefabOptions>
}

export class PrefabCollection {
  private components: Record<string, new (...args: Array<unknown>) => Component>;
  private storage: Record<string, Prefab>;

  constructor(components: Record<string, new (...args: Array<unknown>) => Component>) {
    this.components = components;
    this.storage = {};
  }

  private buildPrefab(options: PrefabOptions): Prefab {
    const {
      name,
      type,
      components = [],
      children = [],
    } = options;

    const prefab = new Prefab();

    prefab.setName(name);
    prefab.setType(type);

    children.forEach((child) => {
      const childPrefab = this.buildPrefab(child);
      childPrefab.setParent(prefab);
      prefab.appendChild(childPrefab);
    });

    components.forEach((componentOptions) => {
      const Component = this.components[componentOptions.name];
      prefab.setComponent(
        componentOptions.name,
        new Component(componentOptions.name, componentOptions.config),
      );
    });

    return prefab;
  }

  register(options: PrefabOptions): void {
    this.storage[options.name] = this.buildPrefab(options);
  }

  get(name: string): Prefab {
    if (!this.storage[name]) {
      throw new Error(`Can't find prefab with same name: ${name}`);
    }

    return this.storage[name].clone();
  }

  getAll(): Array<Prefab> {
    return Object.values(this.storage);
  }
}

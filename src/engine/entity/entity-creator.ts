import uuid from 'uuid-random';

import type { Component } from '../component';
import type {
  Prefab,
  PrefabCollection,
  ComponentOptions,
} from '../prefab';

import IOC from '../ioc/ioc';
import { PREFAB_COLLECTION_KEY_NAME } from '../consts/global';

import { Entity } from './entity';

interface ComponentConstructor {
  new(name: ComponentOptions['name'], options: ComponentOptions['config']): Component
}

export interface EntityOptions {
  id?: string
  name?: string
  type?: string
  children?: Array<EntityOptions>
  components?: Array<ComponentOptions>
  fromPrefab?: boolean
  prefabName?: string
  isNew?: boolean
}

export class EntityCreator {
  private components: Record<string, ComponentConstructor>;
  private prefabCollection: PrefabCollection;

  constructor(components: Record<string, ComponentConstructor>) {
    this.components = components;
    this.prefabCollection = IOC.resolve(PREFAB_COLLECTION_KEY_NAME) as PrefabCollection;
  }

  private buildFromPrefab(options: EntityOptions, prefab: Prefab): Entity {
    const {
      type,
      prefabName = '',
      components = [],
      children = [],
      isNew = false,
    } = options;
    let { id, name } = options;

    id = id || uuid();
    name = name || id;

    if (!prefab) {
      throw new Error(`Can't create game object ${name} from prefab. `
        + `The prefab ${prefabName} is null.`);
    }

    const entity = new Entity({
      id,
      name,
      type: type || prefab.getType(),
      prefabName,
    });

    if (isNew) {
      prefab.getChildren().forEach((prefabChild) => {
        const childOptions = {
          name: prefabChild.getName(),
          prefabName: prefabChild.getName(),
          type: prefabChild.getType(),
          fromPrefab: true,
          isNew,
        };

        const entityChild = this.build(childOptions, prefabChild);
        entity.appendChild(entityChild);
      });
    } else {
      const prefabChildrenMap = prefab.getChildren().reduce(
        (storage: Record<string, Prefab>, prefabChild) => {
          storage[prefabChild.getName()] = prefabChild;

          return storage;
        }, {},
      );

      children.forEach((childOptions) => {
        const { prefabName: childPrefabName, fromPrefab } = childOptions;

        const prefabChild = fromPrefab ? prefabChildrenMap[childPrefabName as string] : void 0;
        const entityChild = this.build(childOptions, prefabChild);
        entity.appendChild(entityChild);
      });
    }

    prefab.getAvailableComponents().forEach((componentName) => {
      const component = prefab.getComponent(componentName);
      if (component) {
        entity.setComponent(componentName, component);
      }
    });

    components.forEach((componentOptions) => {
      const Component = this.components[componentOptions.name];
      entity.setComponent(
        componentOptions.name,
        new Component(componentOptions.name, componentOptions.config),
      );
    });

    return entity;
  }

  private buildFromScratch(options: EntityOptions): Entity {
    const {
      name,
      type,
      components = [],
      children = [],
    } = options;
    let { id } = options;

    id = id || uuid();

    const entity = new Entity({
      id,
      name: name as string,
      type,
    });

    children.forEach((child) => {
      const entityChild = this.build(child);
      entity.appendChild(entityChild);
    });

    components.forEach((componentOptions) => {
      const Component = this.components[componentOptions.name];
      entity.setComponent(
        componentOptions.name,
        new Component(componentOptions.name, componentOptions.config),
      );
    });

    return entity;
  }

  private build(options: EntityOptions, prefab?: Prefab): Entity {
    const { prefabName, fromPrefab } = options;

    if (fromPrefab) {
      prefab = prefab || this.prefabCollection.get(prefabName as string);

      return this.buildFromPrefab(options, prefab);
    }

    return this.buildFromScratch(options);
  }

  private expandEntity(
    entity: Entity,
    entities?: Array<Entity>,
  ): Array<Entity> {
    entities = entities || [];

    entities.push(entity);

    entity.getChildren().forEach((child) => {
      this.expandEntity(child, entities);
    });

    return entities;
  }

  create(options: EntityOptions): Array<Entity> {
    return this.expandEntity(this.build(options));
  }
}

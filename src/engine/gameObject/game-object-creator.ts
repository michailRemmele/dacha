import uuid from 'uuid-random';

import type { Component } from '../component';
import type {
  Prefab,
  PrefabCollection,
  ComponentOptions,
} from '../prefab';

import IOC from '../ioc/ioc';
import { PREFAB_COLLECTION_KEY_NAME } from '../consts/global';

import { GameObject } from './game-object';

interface ComponentConstructor {
  new(name: ComponentOptions['name'], options: ComponentOptions['config']): Component
}

export interface GameObjectOptions {
  id?: string
  name?: string
  type?: string
  children?: Array<GameObjectOptions>
  components?: Array<ComponentOptions>
  fromPrefab?: boolean
  prefabName?: string
  isNew?: boolean
}

export class GameObjectCreator {
  private components: Record<string, ComponentConstructor>;
  private prefabCollection: PrefabCollection;

  constructor(components: Record<string, ComponentConstructor>) {
    this.components = components;
    this.prefabCollection = IOC.resolve(PREFAB_COLLECTION_KEY_NAME) as PrefabCollection;
  }

  private buildFromPrefab(options: GameObjectOptions, prefab: Prefab): GameObject {
    const {
      type,
      prefabName = '',
      components = [],
      children = [],
      isNew = false,
    } = options;
    let { id, name } = options;

    id = id || uuid();
    name = name || prefabName;

    if (!prefab) {
      throw new Error(`Can't create game object ${name} from prefab. `
        + `The prefab ${prefabName} is null.`);
    }

    const gameObject = new GameObject({
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

        const gameObjectChild = this.build(childOptions, prefabChild);
        gameObject.appendChild(gameObjectChild);
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
        const gameObjectChild = this.build(childOptions, prefabChild);
        gameObject.appendChild(gameObjectChild);
      });
    }

    prefab.getAvailableComponents().forEach((componentName) => {
      const component = prefab.getComponent(componentName);
      if (component) {
        gameObject.setComponent(componentName, component);
      }
    });

    components.forEach((componentOptions) => {
      const Component = this.components[componentOptions.name];
      gameObject.setComponent(
        componentOptions.name,
        new Component(componentOptions.name, componentOptions.config),
      );
    });

    return gameObject;
  }

  private buildFromScratch(options: GameObjectOptions): GameObject {
    const {
      name,
      type,
      components = [],
      children = [],
    } = options;
    let { id } = options;

    id = id || uuid();

    const gameObject = new GameObject({
      id,
      name: name as string,
      type,
    });

    children.forEach((child) => {
      const gameObjectChild = this.build(child);
      gameObject.appendChild(gameObjectChild);
    });

    components.forEach((componentOptions) => {
      const Component = this.components[componentOptions.name];
      gameObject.setComponent(
        componentOptions.name,
        new Component(componentOptions.name, componentOptions.config),
      );
    });

    return gameObject;
  }

  private build(options: GameObjectOptions, prefab?: Prefab): GameObject {
    const { prefabName, fromPrefab } = options;

    if (fromPrefab) {
      prefab = prefab || this.prefabCollection.get(prefabName as string);

      return this.buildFromPrefab(options, prefab);
    }

    return this.buildFromScratch(options);
  }

  private expandGameObject(
    gameObject: GameObject,
    gameObjects?: Array<GameObject>,
  ): Array<GameObject> {
    gameObjects = gameObjects || [];

    gameObjects.push(gameObject);

    gameObject.getChildren().forEach((child) => {
      this.expandGameObject(child, gameObjects);
    });

    return gameObjects;
  }

  create(options: GameObjectOptions): Array<GameObject> {
    return this.expandGameObject(this.build(options));
  }
}

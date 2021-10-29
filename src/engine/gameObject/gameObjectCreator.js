import uuid from 'uuid-random';

import IOC from '../ioc/ioc';
import { PREFAB_COLLECTION_KEY_NAME } from '../consts/global';

import { GameObject } from './game-object';

class GameObjectCreator {
  constructor(components) {
    this._components = components;
    this._prefabCollection = IOC.resolve(PREFAB_COLLECTION_KEY_NAME);
  }

  _buildFromPrefab(options, prefab) {
    const {
      type,
      prefabName,
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

    const gameObject = new GameObject(id);

    gameObject.setType(type || prefab.getType());

    if (isNew) {
      prefab.getChildren().forEach((prefabChild) => {
        const { name: childName } = prefabChild;
        const childOptions = { prefabName: childName, fromPrefab: true, isNew };

        const gameObjectChild = this._build(childOptions, prefabChild);
        gameObject.appendChild(gameObjectChild);
      });
    } else {
      const prefabChildrenMap = prefab.getChildren().reduce((storage, prefabChild) => {
        storage[prefabChild.getName()] = prefabChild;

        return storage;
      }, {});

      children.forEach((childOptions) => {
        const { prefabName: childPrefabName, fromPrefab } = childOptions;

        const prefabChild = fromPrefab ? prefabChildrenMap[childPrefabName] : void 0;
        const gameObjectChild = this._build(childOptions, prefabChild);
        gameObject.appendChild(gameObjectChild);
      });
    }

    prefab.getAvailableComponents().forEach((componentName) => {
      gameObject.setComponent(componentName, prefab.getComponent(componentName));
    });

    components.forEach((componentOptions) => {
      const Component = this._components[componentOptions.name];
      gameObject.setComponent(
        componentOptions.name,
        new Component(componentOptions.name, componentOptions.config),
      );
    });

    return gameObject;
  }

  _buildFromScratch(options) {
    const {
      type,
      components = [],
      children = [],
    } = options;
    let { id } = options;

    id = id || uuid();

    const gameObject = new GameObject(id);

    gameObject.setType(type);

    children.forEach((child) => {
      const gameObjectChild = this._build(child);
      gameObject.appendChild(gameObjectChild);
    });

    components.forEach((componentOptions) => {
      const Component = this._components[componentOptions.name];
      gameObject.setComponent(
        componentOptions.name,
        new Component(componentOptions.name, componentOptions.config),
      );
    });

    return gameObject;
  }

  _build(options, prefab) {
    const { prefabName, fromPrefab } = options;

    if (fromPrefab) {
      prefab = prefab || this._prefabCollection.get(prefabName);

      return this._buildFromPrefab(options, prefab);
    }

    return this._buildFromScratch(options);
  }

  _expandGameObject(gameObject, gameObjects) {
    gameObjects = gameObjects || [];

    gameObjects.push(gameObject);

    gameObject.getChildren().forEach((child) => {
      this._expandGameObject(child, gameObjects);
    });

    return gameObjects;
  }

  create(options) {
    return this._expandGameObject(this._build(options));
  }
}

export default GameObjectCreator;

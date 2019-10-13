import uuid from 'uuid-random';

import IOC from 'engine/ioc/ioc';
import GameObject from 'engine/gameObject/gameObject';

import { PREFAB_COLLECTION_KEY_NAME } from 'engine/consts/global';

class GameObjectCreator {
  constructor(components) {
    this._components = components;
    this._prefabCollection = IOC.resolve(PREFAB_COLLECTION_KEY_NAME);
  }

  _buildFromPrefab(options, prefab) {
    const {
      prefabName,
      components = [],
      children = [],
    } = options;
    let { id, name } = options;

    id = id ? id : uuid();
    name = name ? name : id;

    if (!prefab) {
      throw new Error(`Can't create game object ${name} from prefab. `
        + `The prefab ${prefabName} is null.`);
    }

    const gameObject = new GameObject(id);

    const prefabChildrenMap = prefab.getChildren().reduce((storage, prefabChild) => {
      storage[prefabChild.getName()] = prefabChild;

      return storage;
    }, {});

    children.forEach((child) => {
      const { prefabName, fromPrefab } = child;

      const prefabChild = fromPrefab ? prefabChildrenMap[prefabName] : undefined;
      const gameObjectChild = this._build(child, prefabChild);
      gameObjectChild.setParent(gameObject);
      gameObject.appendChild(gameObjectChild);
    });

    prefab.getAvailableComponents().forEach((componentName) => {
      gameObject.setComponent(componentName, prefab.getComponent(componentName));
    });

    components.forEach((componentOptions) => {
      const Component = this._components[componentOptions.name];
      gameObject.setComponent(componentOptions.name, new Component(componentOptions.config));
    });

    return gameObject;
  }

  _buildFromScratch(options) {
    const {
      components = [],
      children = [],
    } = options;
    let { id } = options;

    id = id ? id : uuid();

    const gameObject = new GameObject(id);

    children.forEach((child) => {
      const gameObjectChild = this._build(child);
      gameObjectChild.setParent(gameObject);
      gameObject.appendChild(gameObjectChild);
    });

    components.forEach((componentOptions) => {
      const Component = this._components[componentOptions.name];
      gameObject.setComponent(componentOptions.name, new Component(componentOptions.config));
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

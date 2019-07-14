import uuid from 'uuid/v4';

import GameObject from 'engine/gameObject/gameObject';
import Prefab from 'engine/prefab/prefab';

class GameObjectCreator {
  constructor(components) {
    this._components = components;
    this._storage = {};
  }

  _buildPrefab(options) {
    const prefab = new Prefab();

    prefab.setName(options.name);

    options.children.forEach((child) => {
      const childPrefab = this._buildPrefab(child);
      childPrefab.setParent(prefab);
      prefab.appendChild(childPrefab);
    });

    options.components.forEach((componentOptions) => {
      const Component = this._components[componentOptions.name];
      prefab.setComponent(componentOptions.name, new Component(componentOptions.config));
    });

    return prefab;
  }

  _buildGameObject(options, prefab) {
    let { id } = options;
    const { components, children } = options;

    id = id ? id : uuid();

    const gameObject = new GameObject(id);

    const childrenMap = children.reduce((storage, child) => {
      storage[child.name] = child;

      return storage;
    }, {});

    prefab.getChildren().forEach((child) => {
      if (!childrenMap[child.getName()]) {
        return;
      }

      const gameObjectChild = this._buildGameObject(childrenMap[child.getName()], child);
      gameObjectChild.setParent(gameObject);
      gameObject.appendChild(gameObjectChild);
    });

    prefab.getAvailableComponents().forEach((componentName) => {
      gameObject.setComponent(componentName, prefab.getComponent(componentName));
    });

    if (components) {
      components.forEach((componentOptions) => {
        const Component = this._components[componentOptions.name];
        gameObject.setComponent(componentOptions.name, new Component(componentOptions.config));
      });
    }

    return gameObject;
  }

  _expandGameObject(gameObject, gameObjects) {
    gameObjects = gameObjects || [];

    gameObjects.push(gameObject);

    gameObject.getChildren().forEach((child) => {
      this._expandGameObject(child, gameObjects);
    });

    return gameObjects;
  }

  register(options) {
    this._storage[options.name] = this._buildPrefab(options);
  }

  create(options) {
    const { name } = options;

    if (!this._storage[name]) {
      throw new Error(`Can't create game object with same name: ${name}`);
    }

    const gameObject = this._buildGameObject(options, this._storage[name].clone());

    return this._expandGameObject(gameObject);
  }
}

export default GameObjectCreator;

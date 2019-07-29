import uuid from 'uuid-random';

import IOC from 'engine/ioc/ioc';
import GameObject from 'engine/gameObject/gameObject';

import { PREFAB_COLLECTION_KEY_NAME } from 'engine/consts/global';

class GameObjectCreator {
  constructor(components) {
    this._components = components;
    this._prefabCollection = IOC.resolve(PREFAB_COLLECTION_KEY_NAME);
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

  create(options) {
    const { name } = options;

    const gameObject = this._buildGameObject(options, this._prefabCollection.get(name));

    return this._expandGameObject(gameObject);
  }
}

export default GameObjectCreator;

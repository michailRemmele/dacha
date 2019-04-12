import uuid from 'uuid/v4';

import Prefab from 'engine/prefab/prefab';

class GameObjectCreator {
  constructor(components) {
    this._components = components;
    this._storage = {};
  }

  register(options) {
    const prefab = new Prefab(options.sortingLayer);

    options.components.forEach((componentOptions) => {
      const Component = this._components[componentOptions.name];
      prefab.setComponent(componentOptions.name, new Component(componentOptions.config));
    });

    this._storage[options.name] = prefab;
  }

  create(name, id, components) {
    if (!this._storage[name]) {
      throw new Error(`Can't create game object with same name: ${name}`);
    }

    id = id ? id : uuid();

    const gameObject = this._storage[name].createGameObject(id);

    if (components) {
      components.forEach((componentOptions) => {
        const Component = this._components[componentOptions.name];
        gameObject.setComponent(componentOptions.name, new Component(componentOptions.config));
      });
    }

    return gameObject;
  }
}

export default GameObjectCreator;

import uuid from 'uuid/v4';

import Prefab from 'game/prefab/prefab';

class GameObjectCreator {
  constructor() {
    this._storage = {};
  }

  register(options) {
    this._storage[options.name] = new Prefab(options);
  }

  create(name, id) {
    if (!this._storage[name]) {
      throw new Error(`Can't create game object with same name: ${name}`);
    }

    id = id ? id : uuid();

    return this._storage[name].createGameObject(id);
  }
}

export default GameObjectCreator;

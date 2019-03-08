import Prefab from 'game/prefab/prefab';

class GameObjectCreator {
  constructor() {
    this._storage = {};
  }

  register(options) {
    this._storage[options.name] = new Prefab(options);
  }

  create(name) {
    if (!this._storage[name]) {
      throw new Error(`Can't create game object with same name: ${name}`);
    }

    return this._storage[name].createGameObject();
  }
}

export default GameObjectCreator;

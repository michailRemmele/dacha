import GameObject from 'engine/gameObject/gameObject';

class Prefab {
  constructor(sortingLayer) {
    this._sortingLayer = sortingLayer;
    this._components = {};
  }

  setComponent(name, component) {
    this._components[name] = component;
  }

  getComponent(name) {
    if (!this._components[name]) {
      throw new Error(`Can't find component with the following name: ${name}`);
    }

    return this._components[name];
  }

  createGameObject(id) {
    const gameObject = new GameObject(id, this._sortingLayer);

    Object.keys(this._components).forEach((name) => {
      const component = this._components[name].clone();
      gameObject.setComponent(name, component);
    });

    return gameObject;
  }
}

export default Prefab;

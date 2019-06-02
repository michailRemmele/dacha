const COMPONENT_ADDED = 'COMPONENT_ADDED';
const COMPONENT_REMOVED = 'COMPONENT_REMOVED';

class GameObject {
  constructor(id, sortingLayer) {
    this._id = id;
    this._sortingLayer = sortingLayer;
    this._components = {};

    this._subscribers = [];

    this.COMPONENT_ADDED = COMPONENT_ADDED;
    this.COMPONENT_REMOVED = COMPONENT_REMOVED;
  }

  getId() {
    return this._id;
  }

  getSortingLayer() {
    return this._sortingLayer;
  }

  getComponent(name) {
    return this._components[name];
  }

  setComponent(name, component) {
    this._components[name] = component;

    this._subscribers.forEach((callback) => {
      callback({
        type: COMPONENT_ADDED,
        componentName: name,
        gameObject: this,
      });
    });
  }

  removeComponent(name) {
    this._components[name] = undefined;

    this._subscribers.forEach((callback) => {
      callback({
        type: COMPONENT_REMOVED,
        componentName: name,
        gameObject: this,
      });
    });
  }

  subscribe(callback) {
    if (!(callback instanceof Function)) {
      throw new Error('On subscribe callback should be a function');
    }

    this._subscribers.push(callback);
  }
}

export default GameObject;

const COMPONENT_ADDED = 'COMPONENT_ADDED';
const COMPONENT_REMOVED = 'COMPONENT_REMOVED';

class GameObject {
  constructor(id) {
    this._id = id;
    this._components = {};
    this._parent = null;
    this._children = [];
    this._type = null;

    this._subscribers = [];

    this.COMPONENT_ADDED = COMPONENT_ADDED;
    this.COMPONENT_REMOVED = COMPONENT_REMOVED;
  }

  set parent(parent) {
    this._parent = parent;
  }

  get parent() {
    return this._parent;
  }

  getAncestor() {
    const findAncestor = (gameObject) => {
      if (gameObject.parent) {
        return findAncestor(gameObject.parent);
      }

      return gameObject;
    };

    return findAncestor(this);
  }

  appendChild(child) {
    this._children.push(child);
    child.parent = this;
  }

  removeChild(child) {
    this._children = this._children.filter((gameObject) => gameObject.getId() !== child.getId());
    child.parent = void 0;
  }

  getChildren() {
    return this._children;
  }

  getId() {
    return this._id;
  }

  getComponentNamesList() {
    return Object.keys(this._components);
  }

  getComponent(name) {
    return this._components[name];
  }

  setComponent(name, component) {
    this._components[name] = component;
    component.gameObject = this;

    this._subscribers.forEach((callback) => {
      callback({
        type: COMPONENT_ADDED,
        componentName: name,
        gameObject: this,
      });
    });
  }

  removeComponent(name) {
    if (!this._components[name]) {
      return;
    }

    this._components[name].gameObject = void 0;
    this._components = Object.keys(this._components).reduce((acc, key) => {
      if (key !== name) {
        acc[key] = this._components[key];
      }

      return acc;
    }, {});

    this._subscribers.forEach((callback) => {
      callback({
        type: COMPONENT_REMOVED,
        componentName: name,
        gameObject: this,
      });
    });
  }

  getType() {
    return this._type;
  }

  setType(type) {
    this._type = type;
  }

  subscribe(callback) {
    if (!(callback instanceof Function)) {
      throw new Error('On subscribe callback should be a function');
    }

    this._subscribers.push(callback);
  }

  clearSubscriptions() {
    this._subscribers = [];
  }
}

export default GameObject;

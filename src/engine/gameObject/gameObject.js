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

  setParent(parent) {
    this._parent = parent;
  }

  getParent() {
    return this._parent;
  }

  getAncestor() {
    const findAncestor = (gameObject) => {
      const parent = gameObject.getParent();

      if (parent) {
        return findAncestor(parent);
      }

      return gameObject;
    };

    return findAncestor(this);
  }

  appendChild(child) {
    this._children.push(child);
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
    this._components[name] = void 0;
    component.gameObject = void 0;

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

class GameObject {
  constructor(id) {
    this._id = id;
    this._components = {};
  }

  getId() {
    return this._id;
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

  removeComponent(name) {
    this._components[name] = undefined;
  }
}

export default GameObject;

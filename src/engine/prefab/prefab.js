class Prefab {
  constructor() {
    this._name = null;
    this._components = {};
    this._parent = null;
    this._children = [];
  }

  setName(name) {
    this._name = name;
  }

  getName() {
    return this._name;
  }

  setParent(parent) {
    this._parent = parent;
  }

  getParent() {
    return this._parent;
  }

  appendChild(child) {
    this._children.push(child);
  }

  getChildren() {
    return this._children;
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

  getAvailableComponents() {
    return Object.keys(this._components);
  }

  clone() {
    const prefab = new Prefab();

    prefab.setName(this._name);

    this._children.forEach((child) => {
      const childPrefab = child.clone();
      childPrefab.setParent(prefab);
      prefab.appendChild(childPrefab);
    });

    Object.keys(this._components).forEach((name) => {
      prefab.setComponent(name, this._components[name].clone());
    });

    return prefab;
  }
}

export default Prefab;

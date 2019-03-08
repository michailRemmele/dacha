class GameObject {
  constructor(id) {
    this.id = id;
    this.components = {};
  }

  getId() {
    return this.id;
  }

  setComponent(component) {
    this.components[component.name] = component;
  }

  getComponent(name) {
    if (!this.components[name]) {
      throw new Error(`Can't find component with the following name: ${name}`);
    }

    return this.components[name];
  }

  removeComponent(name) {
    this.components[name] = undefined;
  }
}

export default GameObject;

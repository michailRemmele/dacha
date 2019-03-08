import uuid from 'uuid/v4';

import GameObject from 'game/gameObject/gameObject';
import components from 'game/components';

class Prefab {
  constructor(options) {
    this.components = options.components.reduce((storage, componentOptions) => {
      const Component = components[componentOptions.name];
      storage[componentOptions.name] = new Component(componentOptions.config);
      return storage;
    }, {});
  }

  getComponent(name) {
    if (!this.components[name]) {
      throw new Error(`Can't find component with the following name: ${name}`);
    }

    return this.components[name];
  }

  createGameObject() {
    const gameObject = new GameObject(uuid());

    const clonedComponents = Object.keys(this.components).map((name) => {
      return this.components[name].clone();
    });
    clonedComponents.forEach((component) => {
      gameObject.setComponent(component);
    });

    return gameObject;
  }
}

export default Prefab;

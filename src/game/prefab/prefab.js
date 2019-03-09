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

  createGameObject(id) {
    const gameObject = new GameObject(id);

    Object.keys(this.components).forEach((name) => {
      const component = this.components[name].clone();
      gameObject.setComponent(name, component);
    });

    return gameObject;
  }
}

export default Prefab;

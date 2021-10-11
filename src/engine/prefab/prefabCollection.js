import Prefab from './prefab';

class PrefabCollection {
  constructor(components) {
    this._components = components;
    this._storage = {};
  }

  _buildPrefab(options) {
    const {
      name,
      type,
      components = [],
      children = [],
    } = options;

    const prefab = new Prefab();

    prefab.setName(name);
    prefab.setType(type);

    children.forEach((child) => {
      const childPrefab = this._buildPrefab(child);
      childPrefab.setParent(prefab);
      prefab.appendChild(childPrefab);
    });

    components.forEach((componentOptions) => {
      const Component = this._components[componentOptions.name];
      prefab.setComponent(componentOptions.name, new Component(componentOptions.name, componentOptions.config));
    });

    return prefab;
  }

  register(options) {
    this._storage[options.name] = this._buildPrefab(options);
  }

  get(name) {
    if (!this._storage[name]) {
      throw new Error(`Can't find prefab with same name: ${name}`);
    }

    return this._storage[name].clone();
  }
}

export default PrefabCollection;

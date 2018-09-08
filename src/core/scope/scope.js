import ResolveDependencyStrategy from 'core/ioc/resolveDependencyStrategy';

class Scope {
  constructor() {
    this.storage = {};
  }

  resolve(key, args) {
    if (!this.storage[key]) {
      throw new Error(`Resolution of dependency failed for key: ${key}`);
    }

    return this.storage[key].resolve(args);
  }

  register(key, resolveDependencyStrategy) {
    if (!(resolveDependencyStrategy instanceof ResolveDependencyStrategy)) {
      throw new Error(
        'Resolve dependency strategy should be inherits from ResolveDependencyStrategy'
      );
    }

    this.storage[key] = resolveDependencyStrategy;
  }

  remove(key) {
    this.storage[key] = undefined;
  }
}

export default Scope;

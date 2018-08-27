import ResolveDependencyStrategy from './resolveDependencyStrategy';

class IOC {
  constructor() {
    if (!this.instance) {
      this.instance = this;
      this.storage = {};
    }

    return this.instance;
  }

  resolve(key, ...args) {
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

const instance = new IOC();
Object.freeze(instance);

export default instance;
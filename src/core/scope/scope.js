class Scope {
  constructor() {
    this.storage = {};
  }

  resolve(key, args) {
    return this.storage[key].resolve(args);
  }

  register(key, resolveDependencyStrategy) {
    this.storage[key] = resolveDependencyStrategy;
  }

  remove(key) {
    this.storage[key] = undefined;
  }
}

export default Scope;
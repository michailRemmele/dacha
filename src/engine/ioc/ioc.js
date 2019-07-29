import ScopeProvider from 'engine/scope/scopeProvider';
import ResolveDependencyStrategy from './resolveDependencyStrategy';

class IOC {
  constructor() {
    if (!this.instance) {
      this.instance = this;
    }

    return this.instance;
  }

  resolve(key, ...args) {
    let scope = ScopeProvider.getCurrentScope();
    return scope.resolve(key, args);
  }

  register(key, resolveDependencyStrategy) {
    if (!(resolveDependencyStrategy instanceof ResolveDependencyStrategy)) {
      throw new Error(
        'Resolve dependency strategy should be inherits from ResolveDependencyStrategy'
      );
    }

    let scope = ScopeProvider.getCurrentScope();
    scope.register(key, resolveDependencyStrategy);
  }

  remove(key) {
    let scope = ScopeProvider.getCurrentScope();
    scope.remove(key);
  }
}

const instance = new IOC();
Object.freeze(instance);

export default instance;

import ScopeProvider from '../scope/scopeProvider';
import ResolveDependencyStrategy from './resolveDependencyStrategy';

class IOC {
  constructor() {
    if (!this.instance) {
      this.instance = this;
    }
  }

  resolve(key, ...args) {
    const scope = ScopeProvider.getCurrentScope();
    return scope.resolve(key, args);
  }

  register(key, resolveDependencyStrategy) {
    if (!(resolveDependencyStrategy instanceof ResolveDependencyStrategy)) {
      throw new Error(
        'Resolve dependency strategy should be inherits from ResolveDependencyStrategy',
      );
    }

    const scope = ScopeProvider.getCurrentScope();
    scope.register(key, resolveDependencyStrategy);
  }

  remove(key) {
    const scope = ScopeProvider.getCurrentScope();
    scope.remove(key);
  }
}

const instance = new IOC();
Object.freeze(instance);

export default instance;

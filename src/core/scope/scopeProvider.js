import Scope from './scope';

class ScopeProvider {
  constructor() {
    if (!this.instance) {
      this.instance = this;
      this.scopes = {};
      this.currentScopeName = undefined;
    }

    return this.instance;
  }

  createScope(name) {
    this.scopes[name] = new Scope();
  }

  removeScope(name) {
    this.scopes[name] = undefined;
  }

  setCurrentScope(name) {
    if (!this.scopes[name]) {
      throw new Error('Not found scope with same name');
    }

    this.currentScopeName = name;
  }

  getCurrentScope() {
    if (!this.currentScopeName) {
      throw new Error('Current scope is null');
    }

    return this.scopes[this.currentScopeName];
  }
}

const instance = new ScopeProvider();
Object.seal(instance);

export default instance;
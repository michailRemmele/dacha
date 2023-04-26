import Scope from './scope';

class ScopeProvider {
  constructor() {
    if (!this.instance) {
      this.instance = this;
      this.scopes = {};
      this.currentScopeName = undefined;
      this.scopeChangeSubscribers = [];
    }
  }

  createScope(name) {
    this.scopes[name] = new Scope();
  }

  removeScope(name) {
    this.scopes[name] = undefined;
  }

  setCurrentScope(name) {
    if (!this.scopes[name]) {
      throw new Error(`Error while setting new scope. Not found scope with same name: ${name}`);
    }

    this.currentScopeName = name;

    this.scopeChangeSubscribers.forEach((callback) => {
      callback(this.scopes[this.currentScopeName]);
    });
  }

  getCurrentScope() {
    if (!this.currentScopeName) {
      throw new Error('Current scope is null');
    }

    return this.scopes[this.currentScopeName];
  }

  subscribeOnScopeChange(callback) {
    if (!(callback instanceof Function)) {
      throw new Error('On subscribe callback should be a function');
    }

    this.scopeChangeSubscribers.push(callback);
  }
}

const instance = new ScopeProvider();
Object.seal(instance);

export default instance;

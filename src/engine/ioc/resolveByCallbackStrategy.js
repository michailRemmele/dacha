import ResolveDependencyStrategy from './resolveDependencyStrategy';

class ResolveByCallbackStrategy extends ResolveDependencyStrategy {
  constructor(callback) {
    super();
    this.callback = callback;
  }

  resolve(args) {
    return this.callback(args);
  }
}

export default ResolveByCallbackStrategy;

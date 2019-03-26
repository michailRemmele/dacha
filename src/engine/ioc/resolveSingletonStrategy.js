import ResolveDependencyStrategy from './resolveDependencyStrategy';

class ResolveSingletonStrategy extends ResolveDependencyStrategy {
  constructor(instance) {
    super();
    this.instance = instance;
  }

  resolve() {
    return this.instance;
  }
}

export default ResolveSingletonStrategy;

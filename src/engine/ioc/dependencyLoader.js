import IOC from './ioc';
import ResolveByCallbackStrategy from './resolveByCallbackStrategy';

class DependencyLoader {
  loadAll(dependencies) {
    Object.keys(dependencies).forEach((key) => {
      IOC.register(key, new ResolveByCallbackStrategy(() => new dependencies[key]()));
    });
  }
}

export default DependencyLoader;

import Loader from './loader';

class ScriptLoader extends Loader {
  constructor() {
    super();
    this._supportedExtensions = [ '.js' ];
  }

  getSupportedExtensions() {
    return this._supportedExtensions;
  }

  load(resource) {
    return new Promise((resolve, reject) => {
      const loadableScript = document.createElement('script');
      loadableScript.src = resource;
      document.body.appendChild(loadableScript);
      loadableScript.onload = () => {
        /* eslint-disable */
        resolve(script);
        /* eslint-enable */
      };
      loadableScript.onerror = () => {
        reject(new Error('Failed to load script'));
      };
    });
  }
}

export default ScriptLoader;

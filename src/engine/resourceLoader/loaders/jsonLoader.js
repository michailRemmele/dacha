import Loader from './loader';

class JsonLoader extends Loader {
  constructor() {
    super();
    this._supportedExtensions = ['.json'];
  }

  getSupportedExtensions() {
    return this._supportedExtensions;
  }

  load(resource) {
    return fetch(resource)
      .then((response) => response.json())
      .catch((error) => new Error(`Failed to load json: ${error.message}`));
  }
}

export default JsonLoader;

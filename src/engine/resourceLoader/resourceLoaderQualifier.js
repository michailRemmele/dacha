import loaders from './loaders';

const EXT_SEPARATOR = '.';

class ResourceLoaderQualifier {
  constructor() {
    this.loaders = Object.keys(loaders).map((loaderName) => {
      const Loader = loaders[loaderName];
      return new Loader();
    });
  }

  _getResourceExt(resource) {
    return `${EXT_SEPARATOR}${resource.split(EXT_SEPARATOR).pop()}`;
  }

  getLoader(resource) {
    const resourceExt = this._getResourceExt(resource);
    return this.loaders.find((loader) => loader.getSupportedExtensions().includes(resourceExt));
  }
}

export default ResourceLoaderQualifier;

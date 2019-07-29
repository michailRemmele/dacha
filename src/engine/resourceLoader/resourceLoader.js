import ResourceLoaderQualifier from './resourceLoaderQualifier';

class ResourceLoader {
  constructor() {
    this.resourceLoaderQualifier = new ResourceLoaderQualifier();
  }

  load(resource) {
    return this.resourceLoaderQualifier.getLoader(resource).load(resource);
  }
}

export default ResourceLoader;

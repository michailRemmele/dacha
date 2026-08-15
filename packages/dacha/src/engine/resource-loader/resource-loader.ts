import { ResourceLoaderQualifier } from './resource-loader-qualifier';

export class ResourceLoader {
  private resourceLoaderQualifier: ResourceLoaderQualifier;

  constructor() {
    this.resourceLoaderQualifier = new ResourceLoaderQualifier();
  }

  load(resourceUrl: string): Promise<unknown> {
    if (!resourceUrl) {
      return Promise.reject();
    }

    const loader = this.resourceLoaderQualifier.getLoader(resourceUrl);

    if (!loader) {
      return Promise.reject();
    }

    return loader.load(resourceUrl);
  }
}

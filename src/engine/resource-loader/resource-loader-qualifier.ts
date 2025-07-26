import { loaders } from './loaders';
import type { Loader } from './loaders/loader';

const EXT_SEPARATOR = '.';

export class ResourceLoaderQualifier {
  private loaders: Loader[];

  constructor() {
    this.loaders = Object.keys(loaders).map((loaderName) => {
      const Loader = loaders[loaderName];
      return new Loader();
    });
  }

  private getResourceExt(resourceUrl: string): string {
    return `${EXT_SEPARATOR}${resourceUrl.split(EXT_SEPARATOR).pop() as string}`;
  }

  getLoader(resourceUrl: string): Loader | undefined {
    const resourceExt = this.getResourceExt(resourceUrl);
    return this.loaders.find((loader) => loader.getSupportedExtensions().includes(resourceExt));
  }
}

import { Loader } from './loader';

export class JsonLoader implements Loader {
  private supportedExtensions: string[];

  constructor() {
    this.supportedExtensions = ['.json'];
  }

  getSupportedExtensions(): string[] {
    return this.supportedExtensions;
  }

  load(resourceUrl: string): Promise<unknown> {
    return fetch(resourceUrl)
      .then((response) => response.json())
      .catch((error: Error) => new Error(`Failed to load json: ${error.message}`));
  }
}

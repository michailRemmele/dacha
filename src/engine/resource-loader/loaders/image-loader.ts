import type { Loader } from './loader';

export class ImageLoader implements Loader {
  private supportedExtensions: string[];

  constructor() {
    this.supportedExtensions = ['.png'];
  }

  getSupportedExtensions(): string[] {
    return this.supportedExtensions;
  }

  load(resourceUrl: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = resourceUrl;
      image.onload = (): void => {
        resolve(image);
      };
      image.onerror = (): void => {
        reject(new Error('Failed to load image'));
      };
    });
  }
}

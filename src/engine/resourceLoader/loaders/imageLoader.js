import Loader from './loader';

class ImageLoader extends Loader {
  constructor() {
    super();
    this._supportedExtensions = ['.png'];
  }

  getSupportedExtensions() {
    return this._supportedExtensions;
  }

  load(resource) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.src = resource;
      image.onload = () => {
        resolve(image);
      };
      image.onerror = () => {
        reject(new Error('Failed to load image'));
      };
    });
  }
}

export default ImageLoader;

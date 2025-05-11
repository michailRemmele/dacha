import { Texture } from 'three/src/Three';

import type { Sprite } from '../../components/sprite';

export class SpriteCropper {
  private canvas: HTMLCanvasElement;
  private canvasContext: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvasContext = this.canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;
  }

  crop(spriteTexture: HTMLImageElement, sprite: Sprite): Array<Texture> {
    const frames = sprite.slice;

    if (frames <= 0) {
      return [];
    }

    const width = Math.max(spriteTexture.width / frames, 1);
    const height = Math.max(spriteTexture.height, 1);

    this.canvas.width = width;
    this.canvas.height = height;

    const textures = new Array<Texture>(frames);

    for (let i = 0; i < frames; i += 1) {
      this.canvasContext.clearRect(0, 0, width, height);

      this.canvasContext.drawImage(
        spriteTexture,
        width * i,
        0,
        width,
        height,
        0,
        0,
        width,
        height,
      );

      const frameImageData = this.canvasContext.getImageData(0, 0, width, height);

      // Some issue with three.js d.ts probably,
      // cause it should take ImageData as first argument
      const texture = new Texture(frameImageData as unknown as HTMLImageElement);

      textures[i] = texture;
    }

    return textures;
  }
}

import { Texture } from 'three';

import type { Renderable } from '../../components/renderable';

export class SpriteCropper {
  private canvas: HTMLCanvasElement;
  private canvasContext: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvasContext = this.canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  crop(sprite: HTMLImageElement, renderable: Renderable): Array<Texture> {
    const frames = renderable.slice as number;
    const width = sprite.width / frames;
    const height = sprite.height;

    this.canvas.width = width;
    this.canvas.height = height;

    const textures = new Array<Texture>(frames);

    for (let i = 0; i < frames; i += 1) {
      this.canvasContext.clearRect(0, 0, width, height);

      this.canvasContext.drawImage(
        sprite,
        width * i, 0,
        width, height,
        0, 0,
        width, height,
      );

      const frameImageData = this.canvasContext.getImageData(0, 0, width, height);

      // Some issue with three.js d.ts probably,
      // cause it should take ImageData as first argument
      const texture = new Texture(frameImageData as unknown as HTMLImageElement);
      texture.needsUpdate = true;

      textures[i] = texture;
    }

    return textures;
  }
}

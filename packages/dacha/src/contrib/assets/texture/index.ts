import { TextureSource, Texture as PixiTexture } from 'pixi.js';

import { MediaAsset } from '../../../engine/asset';
import { DefineAsset, DefineField } from '../../../engine/decorators';

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = (): void => resolve(image);
    image.onerror = (): void =>
      reject(new Error(`Can't load the image: ${src}`));
    image.src = src;
  });

/**
 * How a texture is sampled when it is drawn larger or smaller than the image.
 *
 * - `nearest`: sharp pixels. Use it for pixel art.
 * - `linear`: smooth blending between pixels.
 *
 * @category Assets
 */
export type TextureFilter = 'nearest' | 'linear';

/**
 * The `data` of a texture asset in the configuration.
 *
 * @category Assets
 */
export interface TextureData {
  /** Path to the image. */
  src?: string;
  /** How the texture is sampled. The default is `nearest`. */
  filter?: TextureFilter;
}

/**
 * Texture asset. Points to an image file.
 * Its {@link MediaAsset.resource} is a pixi.js texture.
 *
 * @category Assets
 */
@DefineAsset({ name: 'texture' })
export class Texture extends MediaAsset<PixiTexture> {
  /** Path to the image file */
  @DefineField({
    type: 'file',
    initialValue: '',
    extensions: ['png', 'jpg', 'jpeg', 'webp'],
  })
  src!: string;

  /** How the texture is sampled when it is scaled */
  @DefineField({
    type: 'select',
    initialValue: 'nearest',
    options: ['nearest', 'linear'],
  })
  filter!: TextureFilter;

  protected async fetchResource(): Promise<PixiTexture> {
    const image = await loadImage(this.src);
    const source = TextureSource.from({
      resource: image,
      scaleMode: this.filter,
    });
    return new PixiTexture({ source });
  }

  protected disposeResource(resource: PixiTexture): void {
    resource.destroy(true);
  }
}

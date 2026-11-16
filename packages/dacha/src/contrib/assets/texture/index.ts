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
 * What a texture gives outside its image, for example to a shader that
 * scrolls its coordinates.
 *
 * - `clamp`: the color of the nearest edge.
 * - `repeat`: the image again, as tiles.
 *
 * @category Assets
 */
export type TextureWrap = 'clamp' | 'repeat';

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
  /** What the texture gives outside its image. The default is `clamp`. */
  wrap?: TextureWrap;
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

  /** What the texture gives outside its image */
  @DefineField({
    type: 'select',
    initialValue: 'clamp',
    options: ['clamp', 'repeat'],
  })
  wrap!: TextureWrap;

  protected async fetchResource(): Promise<PixiTexture> {
    const image = await loadImage(this.src);
    const source = TextureSource.from({
      resource: image,
      scaleMode: this.filter,
      addressMode: this.wrap === 'repeat' ? 'repeat' : 'clamp-to-edge',
    });
    return new PixiTexture({ source });
  }

  protected disposeResource(resource: PixiTexture): void {
    resource.destroy(true);
  }
}

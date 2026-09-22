import { Asset } from '../../../engine/asset';
import type { AssetOptions } from '../../../engine/asset';

/**
 * The `data` of a texture asset in the configuration.
 *
 * @category Assets
 */
export interface TextureData {
  /** Path to the image. */
  src?: string;
}

/**
 * Texture asset. Points to an image file used by view components and shaders.
 *
 * @category Assets
 */
export class Texture extends Asset {
  /** Path to the image file */
  src: string;

  constructor(options: AssetOptions<TextureData>) {
    super(options);

    this.src = options.data.src ?? '';
  }
}

Texture.assetName = 'texture';

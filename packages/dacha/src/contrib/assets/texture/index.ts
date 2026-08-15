import { Asset } from '../../../engine/asset';
import type { AssetOptions } from '../../../engine/asset';

export interface TextureData {
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

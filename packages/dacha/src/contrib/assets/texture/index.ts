import { Asset } from '../../../engine/asset';
import { DefineAsset, DefineField } from '../../../engine/decorators';
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
@DefineAsset({ name: 'texture' })
export class Texture extends Asset {
  /** Path to the image file */
  @DefineField({ type: 'file', extensions: ['png', 'jpg', 'jpeg', 'webp'] })
  src: string;

  constructor(options: AssetOptions<TextureData>) {
    super(options);

    this.src = options.data.src ?? '';
  }
}

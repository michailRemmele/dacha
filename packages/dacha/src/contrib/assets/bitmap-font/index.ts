import { Asset } from '../../../engine/asset';
import type { AssetOptions } from '../../../engine/asset';

export interface BitmapFontData {
  src?: string;
}

/**
 * Bitmap font asset. Points to a font descriptor file; companion pages
 * are resolved by the loader.
 *
 * @category Assets
 */
export class BitmapFont extends Asset {
  /** Path to the font descriptor file */
  src: string;

  constructor(options: AssetOptions<BitmapFontData>) {
    super(options);

    this.src = options.data.src ?? '';
  }
}

BitmapFont.assetName = 'bitmapFont';

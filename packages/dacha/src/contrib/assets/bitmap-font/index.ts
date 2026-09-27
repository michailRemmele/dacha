import { Asset } from '../../../engine/asset';
import { DefineAsset, DefineField } from '../../../engine/decorators';
import type { AssetOptions } from '../../../engine/asset';

/**
 * The `data` of a bitmap font asset in the configuration.
 *
 * @category Assets
 */
export interface BitmapFontData {
  /** Path to the font file. */
  src?: string;
}

/**
 * Bitmap font asset. Points to a font descriptor file; companion pages
 * are resolved by the loader.
 *
 * @category Assets
 */
@DefineAsset({ name: 'bitmapFont' })
export class BitmapFont extends Asset {
  /** Path to the font descriptor file */
  @DefineField({ type: 'file', extensions: ['fnt', 'xml'] })
  src: string;

  constructor(options: AssetOptions<BitmapFontData>) {
    super(options);

    this.src = options.data.src ?? '';
  }
}

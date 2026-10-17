import {
  Assets as PixiAssets,
  type BitmapFont as PixiBitmapFont,
} from 'pixi.js';

import { MediaAsset } from '../../../engine/asset';
import { DefineAsset, DefineField } from '../../../engine/decorators';

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
 * Bitmap font asset. Points to a font descriptor file.
 * Its {@link MediaAsset.resource} is a pixi.js bitmap font.
 *
 * A loaded font stays loaded until the game ends.
 *
 * @category Assets
 */
@DefineAsset({ name: 'bitmapFont' })
export class BitmapFont extends MediaAsset<PixiBitmapFont> {
  /** Path to the font descriptor file */
  @DefineField({ type: 'file', initialValue: '', extensions: ['fnt', 'xml'] })
  src!: string;

  protected async fetchResource(): Promise<PixiBitmapFont> {
    return (await PixiAssets.load(this.src)) as PixiBitmapFont;
  }
}

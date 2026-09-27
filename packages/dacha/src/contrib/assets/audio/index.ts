import { Asset } from '../../../engine/asset';
import { DefineAsset, DefineField } from '../../../engine/decorators';
import type { AssetOptions } from '../../../engine/asset';

/**
 * The `data` of an audio asset in the configuration.
 *
 * @category Assets
 */
export interface AudioData {
  /** Path to the sound file. */
  src?: string;
}

/**
 * Audio asset. Points to a sound file played by the audio system.
 *
 * @category Assets
 */
@DefineAsset({ name: 'audio' })
export class Audio extends Asset {
  /** Path to the sound file */
  @DefineField({ type: 'file', extensions: ['mp3', 'wav', 'ogg'] })
  src: string;

  constructor(options: AssetOptions<AudioData>) {
    super(options);

    this.src = options.data.src ?? '';
  }
}

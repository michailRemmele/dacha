import { Asset } from '../../../engine/asset';
import type { AssetOptions } from '../../../engine/asset';

export interface AudioData {
  src?: string;
}

/**
 * Audio asset. Points to a sound file played by the audio system.
 *
 * @category Assets
 */
export class Audio extends Asset {
  /** Path to the sound file */
  src: string;

  constructor(options: AssetOptions<AudioData>) {
    super(options);

    this.src = options.data.src ?? '';
  }
}

Audio.assetName = 'audio';

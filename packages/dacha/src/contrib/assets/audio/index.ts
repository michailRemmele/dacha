import { MediaAsset } from '../../../engine/asset';
import { DefineAsset, DefineField } from '../../../engine/decorators';

import { decodeAudio } from './decode';

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
 * Its {@link MediaAsset.resource} is an `AudioBuffer`.
 *
 * @category Assets
 */
@DefineAsset({ name: 'audio' })
export class Audio extends MediaAsset<AudioBuffer> {
  /** Path to the sound file */
  @DefineField({
    type: 'file',
    initialValue: '',
    extensions: ['mp3', 'wav', 'ogg'],
  })
  src!: string;

  protected async fetchResource(): Promise<AudioBuffer> {
    const response = await fetch(this.src);
    return decodeAudio(await response.arrayBuffer());
  }
}

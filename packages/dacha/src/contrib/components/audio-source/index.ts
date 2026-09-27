import { Component } from '../../../engine/component';
import {
  DefineComponent,
  DefineField,
  type GetFieldOptionsFn,
} from '../../../engine/decorators';
import type { AudioGroup } from '../../systems/audio-system/types';

const MASTER_GROUP = 'master';
const AUDIO_GROUPS_PATH = [
  'globalOptions',
  'name:audioGroups',
  'options',
  'groups',
];

const groupOptions: GetFieldOptionsFn = (getState) => [
  MASTER_GROUP,
  ...((getState(AUDIO_GROUPS_PATH) as AudioGroup[] | undefined) ?? []).map(
    (group) => group.name,
  ),
];

/**
 * Options for {@link AudioSource}.
 *
 * @category Audio
 */
export interface AudioSourceConfig {
  src: string;
  group: string;
  looped: boolean;
  volume: number;
  autoplay: boolean;
}

/**
 * Plays a sound for an actor. Call `play` and `stop`, or turn on `autoplay`.
 *
 * @see [Audio](https://dachajs.org/systems/audio/)
 *
 * @category Audio
 */
@DefineComponent({ name: 'AudioSource', icon: 'Volume' })
export class AudioSource extends Component {
  /** Path to the audio asset */
  @DefineField({
    type: 'file',
    initialValue: '',
    extensions: ['mp3', 'wav', 'ogg'],
  })
  src: string;
  /** Volume of the audio, from 0 to 1 */
  @DefineField({ type: 'range', initialValue: 1, min: 0, max: 1, step: 0.01 })
  volume: number;
  /** Whether the audio is looped */
  @DefineField({ initialValue: false })
  looped: boolean;
  /** Whether the audio plays automatically when the scene is entered or when the actor is added to the scene */
  @DefineField({ initialValue: false })
  autoplay: boolean;
  /** Group of the audio, used to combine audio sources together and control them at once */
  @DefineField({
    type: 'select',
    initialValue: MASTER_GROUP,
    options: groupOptions,
  })
  group: string;

  /** @internal Whether the audio is currently playing */
  _playing: boolean;
  /** @internal Whether a still-playing sound should restart from the beginning */
  _restarting: boolean;

  constructor(config: AudioSourceConfig) {
    super();

    this.src = config.src;
    this.group = config.group;
    this.looped = config.looped;
    this.volume = config.volume;
    this.autoplay = config.autoplay;

    this._playing = false;
    this._restarting = false;
  }

  /**
   * Starts playback.
   *
   * If the sound is already playing, it restarts from the beginning by
   * default; pass `restart: false` to leave an already-playing instance
   * untouched instead.
   *
   * @param restart - Whether to restart the sound if it's already playing.
   * Defaults to `true`.
   */
  play(restart = true): void {
    if (this._playing && restart) {
      this._restarting = true;
    }

    this._playing = true;
  }

  /**
   * Stops playback.
   */
  stop(): void {
    this._playing = false;
    this._restarting = false;
  }
}

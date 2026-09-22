import { Component } from '../../../engine/component';

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
export class AudioSource extends Component {
  /** Path to the audio asset */
  src: string;
  /** Group of the audio, used to combine audio sources together and control them at once */
  group: string;
  /** Whether the audio is looped */
  looped: boolean;
  /** Volume of the audio, from 0 to 1 */
  volume: number;
  /** Whether the audio plays automatically when the scene is entered or when the actor is added to the scene */
  autoplay: boolean;

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

AudioSource.componentName = 'AudioSource';

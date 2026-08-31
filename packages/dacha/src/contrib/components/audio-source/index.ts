import { Component } from '../../../engine/component';

export interface AudioSourceConfig {
  src: string;
  group: string;
  looped: boolean;
  volume: number;
  autoplay: boolean;
}

/**
 * AudioSource component for playing audio.
 *
 * It handles the playing of audio for an actor.
 * It allows to play audio files and control the volume and looping of the audio.
 *
 * @example
 * ```typescript
 * // Create an audio source
 * const audioSource = new AudioSource({
 *   src: 'assets/audio/some-sound.mp3',
 *   group: 'master',
 *   looped: false,
 *   volume: 1,
 *   autoplay: false,
 * });
 *
 * // Add to actor
 * actor.setComponent(audioSource);
 *
 * // Modify properties
 * audioSource.volume = 0.5; // Set volume to 50%
 *
 * // Play the audio (restarts it from the beginning if it's already playing)
 * audioSource.play();
 *
 * // Play it, but leave an already-playing instance alone instead of
 * // restarting it
 * audioSource.play(false);
 *
 * // Stop the audio
 * audioSource.stop();
 * ```
 *
 * @category Components
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
  /** Whether the audio is autoplayed on scene enter or after actor is added to scene */
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

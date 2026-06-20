export interface AudioAPIHandlers {
  getGroupVolume(group: string): number;
  setGroupVolume(group: string, volume: number): void;
}

/**
 * API that provides synchronous audio mixer controls.
 *
 * Actor playback is controlled through AudioSource component state.
 * This API is intended for global audio state such as group and master volume.
 *
 * @category Systems
 */
export class AudioAPI {
  private handlers: AudioAPIHandlers;

  constructor(handlers: AudioAPIHandlers) {
    this.handlers = handlers;
  }

  /**
   * Current master volume.
   */
  get masterVolume(): number {
    return this.getGroupVolume('master');
  }

  /**
   * Sets the master volume.
   */
  set masterVolume(volume: number) {
    this.setGroupVolume('master', volume);
  }

  /**
   * Returns the volume for an audio group.
   *
   * @param group - Audio group name
   * @returns Audio group volume
   */
  getGroupVolume(group: string): number {
    return this.handlers.getGroupVolume(group);
  }

  /**
   * Sets the volume for an audio group.
   *
   * @param group - Audio group name
   * @param volume - New group volume
   */
  setGroupVolume(group: string, volume: number): void {
    this.handlers.setGroupVolume(group, volume);
  }
}

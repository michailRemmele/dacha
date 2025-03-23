import { Component } from '../../../engine/component';

export interface AudioSourceConfig {
  src: string
  group: string
  looped: boolean
  volume: number
  autoplay: boolean
}

export class AudioSource extends Component {
  src: string;
  group: string;
  looped: boolean;
  volume: number;
  autoplay: boolean;
  playing: boolean;

  constructor(config: AudioSourceConfig) {
    super();

    this.src = config.src;
    this.group = config.group;
    this.looped = config.looped;
    this.volume = config.volume;
    this.autoplay = config.autoplay;
    this.playing = false;
  }

  clone(): AudioSource {
    return new AudioSource({
      src: this.src,
      group: this.group,
      looped: this.looped,
      volume: this.volume,
      autoplay: this.autoplay,
    });
  }
}

AudioSource.componentName = 'AudioSource';

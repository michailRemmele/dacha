import { Frame } from './frame';

interface TimelineConfig {
  frames: Array<Frame>;
  looped: boolean;
}

export class Timeline {
  frames: Array<Frame>;
  looped: boolean;

  constructor(config: TimelineConfig) {
    this.frames = config.frames.map((frame) => new Frame(frame));
    this.looped = config.looped;
  }
}

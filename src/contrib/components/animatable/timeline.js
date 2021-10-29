import Frame from './frame';

class Timeline {
  constructor(config) {
    this._frames = config.frames.map((frame) => new Frame(frame));
    this._looped = config.looped;
  }

  set frames(frames) {
    this._frames = frames;
  }

  get frames() {
    return this._frames;
  }

  set looped(looped) {
    this._looped = looped;
  }

  get looped() {
    return this._looped;
  }
}

export default Timeline;

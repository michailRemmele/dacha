interface FrameConfig {
  index: number;
  rotation: number;
  flipX: boolean;
  flipY: boolean;
  disabled: boolean;
}

export class Frame {
  index: number;
  rotation: number;
  flipX: boolean;
  flipY: boolean;
  disabled: boolean;

  constructor(config: FrameConfig) {
    this.index = config.index;
    this.rotation = config.rotation;
    this.flipX = config.flipX;
    this.flipY = config.flipY;
    this.disabled = config.disabled;
  }
}

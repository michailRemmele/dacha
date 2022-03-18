export type FrameConfig = Record<string, string | number | boolean>;

export interface FrameField {
  path: Array<string>
  value: string | number | boolean
}
export type Frame = Record<string, FrameField>;

interface TimelineConfig {
  frames: Array<FrameConfig | Frame>;
  looped: boolean;
}

const SEPARATOR = '.';

export class Timeline {
  frames: Array<Frame>;
  looped: boolean;

  constructor(config: TimelineConfig) {
    this.frames = config.frames.map((frame) => (
      Object.keys(frame).reduce((acc: Record<string, FrameField>, fieldName) => {
        const field = frame[fieldName];

        if (field instanceof Object) {
          acc[fieldName] = {
            path: field.path.slice(0),
            value: field.value,
          };
        } else {
          acc[fieldName] = {
            path: fieldName.split(SEPARATOR),
            value: field,
          };
        }
        return acc;
      }, {})
    ));
    this.looped = config.looped;
  }
}

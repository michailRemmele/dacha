import type { TimelineConfig } from './types';

const SEPARATOR = '.';

export interface FrameField {
  path: string[];
  value: string | number | boolean;
}
export type Frame = Record<string, FrameField>;

export class Timeline {
  frames: Frame[];
  looped: boolean;

  constructor(config: TimelineConfig) {
    this.frames = config.frames.map((frame) => {
      if (!Array.isArray(frame.fields)) {
        // Frame fields already been parsed and we just need to copy it
        const parsedFrame = frame as unknown as Frame;
        return Object.keys(parsedFrame).reduce(
          (acc, fieldName) => {
            acc[fieldName] = {
              path: parsedFrame[fieldName].path.slice(0),
              value: parsedFrame[fieldName].value,
            };
            return acc;
          },
          {} as Record<string, FrameField>,
        );
      }

      return frame.fields.reduce(
        (acc, field) => {
          acc[field.name] = {
            path: field.name.split(SEPARATOR),
            value: field.value,
          };
          return acc;
        },
        {} as Record<string, FrameField>,
      );
    });
    this.looped = config.looped;
  }
}

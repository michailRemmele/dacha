import { Timeline } from './timeline';
import type { SubstateConfig } from './types';

export class Substate {
  name: string;
  timeline: Timeline;
  x: number;
  y: number;

  constructor(config: SubstateConfig) {
    this.name = config.name;
    this.timeline = new Timeline(config.timeline);
    this.x = config.x;
    this.y = config.y;
  }
}

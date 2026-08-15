import { State } from './state';
import { Timeline } from './timeline';
import type { IndividualStateConfig } from './types';

export class IndividualState extends State {
  timeline: Timeline;

  constructor(config: IndividualStateConfig) {
    super(config);

    const { timeline = { frames: [], looped: false } } = config;

    this.timeline = new Timeline(timeline);
  }
}

import { State, StateConfig } from './state';
import { Timeline } from './timeline';

export interface IndividualStateConfig extends StateConfig {
  timeline: Timeline;
}

export class IndividualState extends State {
  timeline: Timeline;

  constructor(config: IndividualStateConfig) {
    super(config);

    this.timeline = new Timeline(config.timeline);
  }
}

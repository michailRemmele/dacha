import State from './state';
import Timeline from './timeline';

class IndividualState extends State {
  constructor(config) {
    super(config);

    this._timeline = new Timeline(config.timeline);
  }

  set timeline(timeline) {
    this._timeline = timeline;
  }

  get timeline() {
    return this._timeline;
  }

  clone() {
    return new IndividualState({
      name: this.name,
      transitions: this.transitions,
      timeline: this.timeline.clone(),
    });
  }
}

export default IndividualState;

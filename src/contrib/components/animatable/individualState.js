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
}

export default IndividualState;

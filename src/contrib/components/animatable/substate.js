import Timeline from './timeline';
import Condition from './condition';

class Substate {
  constructor(config) {
    this._name = config.name;
    this._timeline = new Timeline(config.timeline);
    this._conditions = config.conditions.map((condition) => {
      return new Condition(condition);
    });
  }

  set name(name) {
    this._name = name;
  }

  get name() {
    return this._name;
  }

  set timeline(timeline) {
    this._timeline = timeline;
  }

  get timeline() {
    return this._timeline;
  }

  set conditions(conditions) {
    this._conditions = conditions;
  }

  get conditions() {
    return this._conditions;
  }
}

export default Substate;

import Condition from './condition';

class Transition {
  constructor(config) {
    this._state = config.state;
    this._time = config.time;
    this._conditions = config.conditions.map((condition) => new Condition(condition));
  }

  set state(state) {
    this._state = state;
  }

  get state() {
    return this._state;
  }

  set time(time) {
    this._time = time;
  }

  get time() {
    return this._time;
  }

  set conditions(conditions) {
    this._conditions = conditions;
  }

  get conditions() {
    return this._conditions;
  }
}

export default Transition;

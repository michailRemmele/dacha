import AnimatableCondition from './animatableCondition';

class AnimatableTransition {
  constructor(config) {
    this._state = config.state;
    this._conditions = config.conditions.map((condition) => {
      return new AnimatableCondition(condition);
    });
  }

  set state(state) {
    this._state = state;
  }

  get state() {
    return this._state;
  }

  set conditions(conditions) {
    this._conditions = conditions;
  }

  get conditions() {
    return this._conditions;
  }

  clone() {
    return new AnimatableTransition({
      state: this.state,
      conditions: this.conditions.map((condition) => {
        return condition.clone();
      }),
    });
  }
}

export default AnimatableTransition;

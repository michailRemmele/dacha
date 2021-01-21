import Transition from './transition';

class State {
  constructor(config) {
    this._name = config.name;
    this._speed = config.speed;
    this._transitions = config.transitions.map((transition) => {
      return new Transition(transition);
    });
  }

  set name(name) {
    this._name = name;
  }

  get name() {
    return this._name;
  }

  set speed(speed) {
    this._speed = speed;
  }

  get speed() {
    return this._speed;
  }

  set transitions(transitions) {
    this._transitions = transitions;
  }

  get transitions() {
    return this._transitions;
  }

  clone() {
    return new State({
      name: this.name,
      speed: this.speed,
      transitions: this.transitions.map((transition) => {
        return transition.clone();
      }),
    });
  }
}

export default State;

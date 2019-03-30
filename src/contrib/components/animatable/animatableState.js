import AnimatableStrip from './animatableStrip';
import AnimatableTransition from './animatableTransition';

class AnimatableState {
  constructor(config) {
    this._name = config.name;
    this._speed = config.speed;
    this._strip = new AnimatableStrip(config.strip);
    this._looped = config.looped;
    this._transitions = config.transitions.map((transition) => {
      return new AnimatableTransition(transition);
    });
    this._previousState = null;
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

  set strip(strip) {
    this._strip = strip;
  }

  get strip() {
    return this._strip;
  }

  set looped(looped) {
    this._looped = looped;
  }

  get looped() {
    return this._looped;
  }

  set transitions(transitions) {
    this._transitions = transitions;
  }

  get transitions() {
    return this._transitions;
  }

  set previousState(previousState) {
    this._previousState = previousState;
  }

  get previousState() {
    return this._previousState;
  }

  clone() {
    return new AnimatableState({
      name: this.name,
      speed: this.speed,
      strip: this.strip.clone(),
      looped: this.looped,
      transitions: this.transitions.map((transition) => {
        return transition.clone();
      }),
    });
  }
}

export default AnimatableState;

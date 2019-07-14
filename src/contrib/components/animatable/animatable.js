import Component from 'engine/component/component';
import AnimatableState from './animatableState';

class Animatable extends Component {
  constructor(config) {
    super();

    this._states = config.states.map((state) => {
      return new AnimatableState(state);
    });
    this._defaultState = config.defaultState;
    this.currentState = this._defaultState;
    this.duration = 0;
  }

  set states(states) {
    this._states = states;
  }

  get states() {
    return this._states;
  }

  set defaultState(defaultState) {
    this._defaultState = defaultState;
  }

  get defaultState() {
    return this._defaultState;
  }

  set currentState(currentState) {
    this._currentState = this.states.find((state) => {
      return state.name === currentState;
    });
  }

  get currentState() {
    return this._currentState;
  }

  set duration(duration) {
    this._duration = duration;
  }

  get duration() {
    return this._duration;
  }

  clone() {
    return new Animatable({
      states: this.states.map((state) => {
        return state.clone();
      }),
      defaultState: this.defaultState,
    });
  }
}

export default Animatable;

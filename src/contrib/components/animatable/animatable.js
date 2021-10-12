import Component from 'engine/component/component';
import IndividualState from './individualState';
import GroupState from './groupState';

class Animatable extends Component {
  constructor(componentName, config) {
    super(componentName, config);

    this._states = config.states.map((state) => {
      if (state.type === 'individual') {
        return new IndividualState(state);
      } else if (state.type === 'group') {
        return new GroupState(state);
      }
    });
    this._initialState = config.initialState;

    this.currentState = this._initialState;
    this._duration = 0;
  }

  set states(states) {
    this._states = states;
  }

  get states() {
    return this._states;
  }

  set initialState(initialState) {
    this._initialState = initialState;
  }

  get initialState() {
    return this._initialState;
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
    return new Animatable(this.componentName, {
      states: this.states,
      initialState: this.initialState,
    });
  }
}

export default Animatable;

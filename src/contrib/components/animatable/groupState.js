import State from './state';
import Substate from './substate';

class GroupState extends State {
  constructor(config) {
    super(config);

    this._substates = config.substates.map((substate) => {
      return new Substate(substate);
    });
  }

  set substates(substates) {
    this._substates = substates;
  }

  get substates() {
    return this._substates;
  }

  clone() {
    return new GroupState({
      name: this.name,
      transitions: this.transitions,
      substates: this.substates.map((substate) => {
        return substate.clone();
      }),
    });
  }
}

export default GroupState;

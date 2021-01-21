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
}

export default GroupState;

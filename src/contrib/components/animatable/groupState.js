import State from './state';
import Substate from './substate';
import pickProps from './pickProps';

class GroupState extends State {
  constructor(config) {
    super(config);

    this._substates = config.substates.map((substate) => {
      return new Substate(substate);
    });
    this._pickMode = config.pickMode;
    this._pickProps = new pickProps[config.pickMode](config.pickProps);
  }

  set substates(substates) {
    this._substates = substates;
  }

  get substates() {
    return this._substates;
  }

  set pickMode(pickMode) {
    this._pickMode = pickMode;
  }

  get pickMode() {
    return this._pickMode;
  }

  set pickProps(pickProps) {
    this._pickProps = pickProps;
  }

  get pickProps() {
    return this._pickProps;
  }
}

export default GroupState;

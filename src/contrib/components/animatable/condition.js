import conditionProps from './conditionProps';

class Condition {
  constructor(config) {
    this._type = config.type;
    this._props = new conditionProps[config.type](config.props);
  }

  set type(type) {
    this._type = type;
  }

  get type() {
    return this._type;
  }

  set props(props) {
    this._props = props;
  }

  get props() {
    return this._props;
  }
}

export default Condition;

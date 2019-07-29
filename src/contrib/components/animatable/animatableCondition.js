class AnimatableCondition {
  constructor(config) {
    this._type = config.type;
    this._props = config.props;
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

  clone() {
    return new AnimatableCondition({
      type: this.type,
      props: {
        ...this.props,
      },
    });
  }
}

export default AnimatableCondition;

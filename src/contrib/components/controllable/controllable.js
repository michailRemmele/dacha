class Controllable {
  constructor(config) {
    this._actions = config.actions;
  }

  set actions(actions) {
    this._actions = actions;
  }

  get actions() {
    return this._actions;
  }

  clone() {
    return new Controllable({
      actions: {
        ...this.actions,
      },
    });
  }
}

export default Controllable;

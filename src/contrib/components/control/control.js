const PREFIX_SEPARATOR = '_';

class Control {
  constructor(config) {
    this._inputEventBindings = config.inputEventBindings;
    this._keyStates = Object.keys(this._inputEventBindings).reduce((keyStates, inputEvent) => {
      keyStates[inputEvent.split(PREFIX_SEPARATOR)[0]] = null;
      return keyStates;
    }, {});
  }

  set inputEventBindings(inputEventBindings) {
    this._inputEventBindings = inputEventBindings;
  }

  get inputEventBindings() {
    return this._inputEventBindings;
  }

  set keyStates(keyStates) {
    this._keyStates = keyStates;
  }

  get keyStates() {
    return this._keyStates;
  }

  clone() {
    return new Control({
      inputEventBindings: {
        ...this.inputEventBindings,
      },
    });
  }
}

export default Control;

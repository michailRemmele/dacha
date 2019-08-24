import Component from 'engine/component/component';

const PREFIX_SEPARATOR = '_';

class KeyboardControl extends Component {
  constructor(config) {
    super();

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
    return new KeyboardControl({
      inputEventBindings: {
        ...this.inputEventBindings,
      },
    });
  }
}

export default KeyboardControl;

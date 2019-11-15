import Component from 'engine/component/component';

class MouseControl extends Component {
  constructor(config) {
    super();

    this._inputEventBindings = config.inputEventBindings;
  }

  set inputEventBindings(inputEventBindings) {
    this._inputEventBindings = inputEventBindings;
  }

  get inputEventBindings() {
    return this._inputEventBindings;
  }

  clone() {
    return new MouseControl({
      inputEventBindings: {
        ...this.inputEventBindings,
      },
    });
  }
}

export default MouseControl;

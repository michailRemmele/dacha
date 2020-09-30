import Component from 'engine/component/component';

class Script extends Component {
  constructor(config) {
    super();

    this._name = config.name;
  }

  set name(name) {
    this._name = name;
  }

  get name() {
    return this._name;
  }

  clone() {
    return new Script({
      name: this.name,
    });
  }
}

export default Script;

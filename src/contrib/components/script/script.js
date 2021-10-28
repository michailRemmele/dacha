import Component from '../../../engine/component/component';

class Script extends Component {
  constructor(componentName, config) {
    super(componentName, config);

    this._name = config.name;
  }

  set name(name) {
    this._name = name;
  }

  get name() {
    return this._name;
  }

  clone() {
    return new Script(this.componentName, {
      name: this.name,
    });
  }
}

export default Script;

import { Component } from '../../../engine/component';

interface ScriptConfig {
  name: string;
}

export class Script extends Component {
  private _name: string;

  constructor(componentName: string, config: ScriptConfig) {
    super(componentName);

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

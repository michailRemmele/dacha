import { Component } from '../../../engine/component';

interface ScriptConfig {
  name: string;
}

export class Script extends Component {
  name: string;

  constructor(componentName: string, config: ScriptConfig) {
    super(componentName);

    this.name = config.name;
  }

  clone() {
    return new Script(this.componentName, {
      name: this.name,
    });
  }
}

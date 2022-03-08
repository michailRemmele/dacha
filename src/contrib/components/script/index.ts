import { Component } from '../../../engine/component';

interface ScriptConfig {
  name: string;
  options: Record<string, unknown>
}

export class Script extends Component {
  name: string;
  options: Record<string, unknown>;

  constructor(componentName: string, config: ScriptConfig) {
    super(componentName);

    this.name = config.name;
    this.options = { ...config.options };
  }

  clone(): Script {
    return new Script(this.componentName, {
      name: this.name,
      options: this.options,
    });
  }
}

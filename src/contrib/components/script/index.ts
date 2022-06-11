import { Component } from '../../../engine/component';

export type ScriptConfig = {
  name: string;
  options: Record<string, unknown>
};

export class Script extends Component {
  name: string;
  options: Record<string, unknown>;

  constructor(componentName: string, config: Record<string, unknown>) {
    super(componentName);

    const scriptConfig = config as ScriptConfig;

    this.name = scriptConfig.name;
    this.options = { ...scriptConfig.options };
  }

  clone(): Script {
    return new Script(this.componentName, {
      name: this.name,
      options: this.options,
    });
  }
}

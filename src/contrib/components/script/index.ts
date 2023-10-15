import { Component } from '../../../engine/component';

export interface ScriptConfig extends Record<string, unknown> {
  name: string
  options: Record<string, unknown>
}

export class Script extends Component {
  name: string;
  options: Record<string, unknown>;

  constructor(config: Record<string, unknown>) {
    super();

    const scriptConfig = config as ScriptConfig;

    this.name = scriptConfig.name;
    this.options = { ...scriptConfig.options };
  }

  clone(): Script {
    return new Script({
      name: this.name,
      options: this.options,
    });
  }
}

Script.componentName = 'Script';

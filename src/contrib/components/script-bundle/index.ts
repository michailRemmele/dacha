import { Component } from '../../../engine/component';

interface ScriptConfig {
  name: string
  options: Record<string, unknown>
}

export interface ScriptBundleConfig {
  scripts: Array<ScriptConfig>
}

export class ScriptBundle extends Component {
  scripts: Array<ScriptConfig>;

  constructor(config: ScriptBundleConfig) {
    super();

    const { scripts } = config;

    this.scripts = scripts;
  }

  clone(): ScriptBundle {
    return new ScriptBundle({
      scripts: this.scripts.map(({ name, options }) => ({ name, options: { ...options } })),
    });
  }
}

ScriptBundle.componentName = 'ScriptBundle';

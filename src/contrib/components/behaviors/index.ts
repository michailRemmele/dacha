import { Component } from '../../../engine/component';

interface BehaviorConfig {
  name: string
  options: Record<string, unknown>
}

export interface BehaviorsConfig {
  list: BehaviorConfig[]
}

export class Behaviors extends Component {
  list: BehaviorConfig[];

  constructor(config: BehaviorsConfig) {
    super();

    const { list } = config;

    this.list = list;
  }

  clone(): Behaviors {
    return new Behaviors({
      list: this.list.map(({ name, options }) => ({ name, options: { ...options } })),
    });
  }
}

Behaviors.componentName = 'Behaviors';

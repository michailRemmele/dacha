import { Component } from '../../../engine/component';

interface BehaviorConfig {
  name: string;
  options: Record<string, unknown>;
}

export interface BehaviorsConfig {
  list: BehaviorConfig[];
}

/**
 * Behaviors component for managing a list of behaviors.
 *
 * Behavior is a script that allows to add custom game logic to an actor,
 * such as movement, AI or any other custom logic.
 *
 * @example
 * ```typescript
 * // Create a behaviors component
 * const behaviors = new Behaviors({
 *   list: [{ name: 'some-script', options: {} }],
 * });
 *
 * // Add to actor
 * actor.setComponent(behaviors);
 * ```
 * 
 * @category Components
 */
export class Behaviors extends Component {
  list: BehaviorConfig[];

  constructor(config: BehaviorsConfig) {
    super();

    const { list } = config;

    this.list = list;
  }

  clone(): Behaviors {
    return new Behaviors({
      list: this.list.map(({ name, options }) => ({
        name,
        options: { ...options },
      })),
    });
  }
}

Behaviors.componentName = 'Behaviors';

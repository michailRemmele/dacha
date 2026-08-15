import { Component } from '../../../engine/component';

export interface BehaviorConfig {
  id: string;
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

    this.list = list.map(({ id, name, options }) => ({
      id,
      name,
      options: { ...options },
    }));
  }
}

Behaviors.componentName = 'Behaviors';

import { Component } from '../../../engine/component';

/**
 * One behavior in the list of {@link Behaviors}.
 *
 * @category Behaviors
 */
export interface BehaviorConfig {
  /** An identifier for the entry. The editor creates it. */
  id: string;
  /** The `behaviorName` of the behavior class. */
  name: string;
  /** Values for the fields of the behavior. The system passes them to the constructor. */
  options: Record<string, unknown>;
}

/**
 * Options for {@link Behaviors}.
 *
 * @category Behaviors
 */
export interface BehaviorsConfig {
  /** The behaviors of the actor. */
  list: BehaviorConfig[];
}

/**
 * Lists the behaviors of an actor. {@link BehaviorSystem} creates an instance of
 * each.
 *
 * @see [Behaviors](https://dachajs.org/systems/behaviors/)
 *
 * @category Behaviors
 */
export class Behaviors extends Component {
  /**
   * The behaviors of the actor. {@link BehaviorSystem} reads the list once, when
   * it creates the behavior instances. To change the behaviors, replace the whole
   * component with `actor.setComponent`.
   */
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

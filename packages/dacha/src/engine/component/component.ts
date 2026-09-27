import type { Actor } from '../actor';
import type { Constructor } from '../../types/utils';

/**
 * A component class: a constructor with a static `componentName`.
 *
 * @category Actors & Components
 */
export type ComponentConstructor<T extends Component = Component> =
  Constructor<T> & { componentName: string };

export const findParentComponent = (
  actor: Actor,
  componentClass: ComponentConstructor,
): Component | undefined => {
  if (!actor.parent || !('getComponent' in actor.parent)) {
    return undefined;
  }

  return actor.parent.getComponent(componentClass);
};

/**
 * Base class for all components.
 *
 * A component stores data for an actor. Extend this class to write your own
 * component, and name it with {@link DefineComponent}. The engine uses the name to
 * find the class for a component in the configuration. A class without the
 * decorator can set a static `componentName` instead.
 *
 * @example
 * ```ts
 * @DefineComponent({ name: 'Health' })
 * class Health extends Component {
 *   @DefineField({ initialValue: 100 })
 *   points: number;
 *
 *   constructor(config: { points: number }) {
 *     super();
 *     this.points = config.points;
 *   }
 * }
 * ```
 *
 * @see [Components](https://dachajs.org/game-code/components/)
 *
 * @category Actors & Components
 */
export abstract class Component {
  /**
   * The name the configuration uses for the component. It must be unique among
   * the components of the game.
   *
   * {@link DefineComponent} sets it, so a game
   * usually does not assign it.
   */
  static componentName: string;
  /**
   * The actor that has this component. It is `undefined` until the component is
   * added to an actor.
   */
  public actor?: Actor;

  constructor() {
    this.actor = undefined;
  }

  /**
   * Returns the component of the same class on the parent actor.
   *
   * @returns The component, or `undefined` if the actor has no parent actor or
   * the parent has no such component.
   */
  getParentComponent(): Component | undefined {
    if (!this.actor) {
      return undefined;
    }

    return findParentComponent(
      this.actor,
      this.constructor as ComponentConstructor,
    );
  }
}

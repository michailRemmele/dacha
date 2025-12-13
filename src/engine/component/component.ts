import type { Actor } from '../actor';
import type { Constructor } from '../../types/utils';

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

export abstract class Component {
  static componentName: string;
  public actor?: Actor;

  constructor() {
    this.actor = undefined;
  }

  getParentComponent(): Component | undefined {
    if (!this.actor) {
      return undefined;
    }

    return findParentComponent(
      this.actor,
      this.constructor as ComponentConstructor,
    );
  }

  abstract clone(): Component;
}

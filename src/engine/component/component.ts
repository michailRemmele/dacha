import { Scene } from '../scene';
import type { Actor } from '../actor';
import type { Constructor } from '../../types/utils';

export type ComponentConstructor<T extends Component = Component>
  = Constructor<T> & { componentName: string };

export const findParentComponent = (
  actor: Actor,
  componentClass: ComponentConstructor,
): Component | undefined => {
  if (!actor.parent || actor.parent instanceof Scene) {
    return void 0;
  }

  const parentComponent = actor.parent.getComponent(componentClass);

  return parentComponent || findParentComponent(actor.parent, componentClass);
};

export abstract class Component {
  static componentName: string;
  public actor?: Actor;

  constructor() {
    this.actor = void 0;
  }

  getParentComponent(): Component | undefined {
    if (!this.actor) {
      return void 0;
    }

    return findParentComponent(this.actor, this.constructor as ComponentConstructor);
  }

  abstract clone(): Component;
}

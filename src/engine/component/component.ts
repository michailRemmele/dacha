import type { GameObject } from '../game-object';
import type { Constructor } from '../../types/utils';

export type ComponentConstructor<T extends Component = Component>
  = Constructor<T> & { componentName: string };

export const findParentComponent = (
  gameObject: GameObject,
  componentClass: ComponentConstructor,
): Component | void => {
  if (!gameObject.parent) {
    return void 0;
  }

  const parentComponent = gameObject.parent.getComponent(componentClass);

  return parentComponent || findParentComponent(gameObject.parent, componentClass);
};

export abstract class Component {
  static componentName: string;
  public gameObject?: GameObject;

  constructor() {
    this.gameObject = void 0;
  }

  getParentComponent(): Component | void {
    if (!this.gameObject) {
      return void 0;
    }

    return findParentComponent(this.gameObject, this.constructor as ComponentConstructor);
  }

  abstract clone(): Component;
}

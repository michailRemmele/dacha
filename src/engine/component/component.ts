import type { GameObject } from '../game-object';
import type { Constructor } from '../../types/utils';

export const findParentComponent = (
  gameObject: GameObject,
  componentClass: Constructor<Component>,
): Component | void => {
  if (!gameObject.parent) {
    return void 0;
  }

  const parentComponent = gameObject.parent.getComponent(componentClass);

  return parentComponent || findParentComponent(gameObject.parent, componentClass);
};

export abstract class Component {
  public gameObject?: GameObject;

  constructor() {
    this.gameObject = void 0;
  }

  getParentComponent(): Component | void {
    if (!this.gameObject) {
      return void 0;
    }

    return findParentComponent(this.gameObject, this.constructor as Constructor<Component>);
  }

  abstract clone(): Component;
}

import { GameObject } from '../gameObject';

export const findParentComponent = (
  gameObject: GameObject,
  componentName: string,
): Component | void => {
  if (!gameObject.parent) {
    return void 0;
  }

  const parentComponent = gameObject.parent.getComponent(componentName);

  return parentComponent || findParentComponent(gameObject.parent, componentName);
};

export abstract class Component {
  public componentName: string;
  public gameObject?: GameObject;

  constructor(name: string) {
    this.componentName = name;
    this.gameObject = void 0;
  }

  getParentComponent() {
    if (!this.gameObject) {
      return void 0;
    }

    return findParentComponent(this.gameObject, this.componentName);
  }

  abstract clone(): Component;
}

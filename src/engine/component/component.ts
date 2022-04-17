import { Entity } from '../entity';

export const findParentComponent = (
  entity: Entity,
  componentName: string,
): Component | void => {
  if (!entity.parent) {
    return void 0;
  }

  const parentComponent = entity.parent.getComponent(componentName);

  return parentComponent || findParentComponent(entity.parent, componentName);
};

export abstract class Component {
  public componentName: string;
  public entity?: Entity;

  constructor(name: string) {
    this.componentName = name;
    this.entity = void 0;
  }

  getParentComponent() {
    if (!this.entity) {
      return void 0;
    }

    return findParentComponent(this.entity, this.componentName);
  }

  abstract clone(): Component;
}

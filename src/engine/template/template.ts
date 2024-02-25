import type { Component, ComponentConstructor } from '../component';
import { BaseObject } from '../base-object';
import type { BaseObjectOptions } from '../base-object';

export class Template extends BaseObject {
  private components: Record<string, Component>;

  declare public readonly children: Array<Template>;

  declare public parent: Template | null;

  constructor(options: BaseObjectOptions) {
    super(options);

    this.components = {};
  }

  override appendChild(child: Template): void {
    super.appendChild(child);
  }

  override removeChild(child: Template): void {
    super.removeChild(child);
  }

  override getObjectById(id: string): Template | undefined {
    return super.getObjectById(id) as Template | undefined;
  }

  override getObjectByName(name: string): Template | undefined {
    return super.getObjectByName(name) as Template | undefined;
  }

  setComponent(component: Component): void {
    const { componentName } = (component.constructor as ComponentConstructor);

    this.components[componentName] = component;
  }

  getComponent<T extends Component>(componentClass: ComponentConstructor<T>): T {
    return this.components[componentClass.componentName] as T;
  }

  getComponents(): Array<Component> {
    return Object.values(this.components);
  }

  clone(): Template {
    const template = new Template({
      id: this.id,
      name: this.name,
    });

    this.children.forEach((child) => {
      template.appendChild(child.clone());
    });

    Object.keys(this.components).forEach((name) => {
      template.setComponent(this.components[name].clone());
    });

    return template;
  }
}

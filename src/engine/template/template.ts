import type { Component, ComponentConstructor } from '../component';
import { Entity } from '../entity';
import type { EntityOptions } from '../entity';

export class Template extends Entity {
  private components: Record<string, Component>;

  declare public readonly children: Array<Template>;

  declare public parent: Template | null;

  constructor(options: EntityOptions) {
    super(options);

    this.components = {};
  }

  override appendChild(child: Template): void {
    super.appendChild(child);
  }

  override removeChild(child: Template): void {
    super.removeChild(child);
  }

  override getEntityById(id: string): Template | undefined {
    return super.getEntityById(id) as Template | undefined;
  }

  override getEntityByName(name: string): Template | undefined {
    return super.getEntityByName(name) as Template | undefined;
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

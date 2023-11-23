import type { Component, ComponentConstructor } from '../component';

interface TemplateOptions {
  id: string
  name: string
}

export class Template {
  readonly id: string;
  readonly name: string;

  private components: Record<string, Component>;
  private parent?: Template;
  private children: Array<Template>;

  constructor(options: TemplateOptions) {
    const { id, name } = options;

    this.id = id;
    this.name = name;

    this.components = {};
    this.parent = void 0;
    this.children = [];
  }

  setParent(parent: Template): void {
    this.parent = parent;
  }

  getParent(): Template | undefined {
    return this.parent;
  }

  appendChild(child: Template): void {
    this.children.push(child);
  }

  getChildren(): Array<Template> {
    return this.children;
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
      const childTemplate = child.clone();
      childTemplate.setParent(template);
      template.appendChild(childTemplate);
    });

    Object.keys(this.components).forEach((name) => {
      template.setComponent(this.components[name].clone());
    });

    return template;
  }
}

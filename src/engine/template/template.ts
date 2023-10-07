import type { Component } from '../component';
import type { Constructor } from '../../types/utils';

interface TemplateOptions {
  id: string
  name: string
  type: string
}

export class Template {
  readonly id: string;
  readonly name: string;
  readonly type: string;

  private components: Record<string, Component>;
  private parent?: Template;
  private children: Array<Template>;

  constructor(options: TemplateOptions) {
    const { id, name, type } = options;

    this.id = id;
    this.name = name;
    this.type = type;

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
    this.components[component.constructor.name] = component;
  }

  getComponent<T extends Component>(componentClass: Constructor<T>): T {
    return this.components[componentClass.name] as T;
  }

  getComponents(): Array<Component> {
    return Object.values(this.components);
  }

  clone(): Template {
    const template = new Template({
      id: this.id,
      name: this.name,
      type: this.type,
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

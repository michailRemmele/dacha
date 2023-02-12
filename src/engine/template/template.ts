import type { Component } from '../component';

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

  setComponent(name: string, component: Component): void {
    this.components[name] = component;
  }

  getComponent(name: string): Component | undefined {
    return this.components[name];
  }

  getAvailableComponents(): Array<string> {
    return Object.keys(this.components);
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
      template.setComponent(name, this.components[name].clone());
    });

    return template;
  }
}

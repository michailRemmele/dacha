import type { Component } from '../component';

export class Template {
  private name: string;
  private components: Record<string, Component>;
  private parent?: Template;
  private children: Array<Template>;
  private type: string;

  constructor() {
    this.name = '';
    this.components = {};
    this.parent = void 0;
    this.children = [];
    this.type = '';
  }

  setName(name: string): void {
    this.name = name;
  }

  getName(): string {
    return this.name;
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

  setType(type: string): void {
    this.type = type;
  }

  getType(): string {
    return this.type;
  }

  clone(): Template {
    const template = new Template();

    template.setName(this.name);
    template.setType(this.type);

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

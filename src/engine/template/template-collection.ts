import type { Component } from '../component';
import type { TemplateConfig } from '../types';

import { Template } from './template';

export class TemplateCollection {
  private components: Record<string, new (...args: Array<unknown>) => Component>;
  private storage: Record<string, Template>;

  constructor(components: Record<string, new (...args: Array<unknown>) => Component>) {
    this.components = components;
    this.storage = {};
  }

  private buildTemplate(options: TemplateConfig): Template {
    const {
      name,
      type,
      components = [],
      children = [],
    } = options;

    const template = new Template();

    template.setName(name);
    template.setType(type);

    children.forEach((child) => {
      const childTemplate = this.buildTemplate(child);
      childTemplate.setParent(template);
      template.appendChild(childTemplate);
    });

    components.forEach((componentOptions) => {
      const Component = this.components[componentOptions.name];
      template.setComponent(
        componentOptions.name,
        new Component(componentOptions.name, componentOptions.config),
      );
    });

    return template;
  }

  register(options: TemplateConfig): void {
    this.storage[options.name] = this.buildTemplate(options);
  }

  get(name: string): Template {
    if (!this.storage[name]) {
      throw new Error(`Can't find template with same name: ${name}`);
    }

    return this.storage[name].clone();
  }

  getAll(): Array<Template> {
    return Object.values(this.storage);
  }
}

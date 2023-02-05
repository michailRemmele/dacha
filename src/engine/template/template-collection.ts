import type { ComponentsMap } from '../component';
import type { TemplateConfig } from '../types';

import { Template } from './template';

export class TemplateCollection {
  private components: ComponentsMap;
  private storage: Record<string, Template>;

  constructor(components: ComponentsMap) {
    this.components = components;
    this.storage = {};
  }

  private buildTemplate(options: TemplateConfig): Template {
    const {
      id,
      name,
      type,
      components = [],
      children = [],
    } = options;

    const template = new Template({ id, name, type });

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
    this.storage[options.id] = this.buildTemplate(options);
  }

  get(id: string): Template {
    if (!this.storage[id]) {
      throw new Error(`Can't find template with the following id: ${id}`);
    }

    return this.storage[id].clone();
  }

  getAll(): Array<Template> {
    return Object.values(this.storage);
  }

  delete(id: string): void {
    delete this.storage[id];
  }
}

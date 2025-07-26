import type { ComponentConstructor } from '../component';
import type { TemplateConfig } from '../types';

import { Template } from './template';

export class TemplateCollection {
  private components: Record<string, ComponentConstructor>;
  private storage: Record<string, Template>;

  constructor(components: ComponentConstructor[]) {
    this.components = components.reduce((acc, ComponentClass) => {
      acc[ComponentClass.componentName] = ComponentClass;
      return acc;
    }, {} as Record<string, ComponentConstructor>);
    this.storage = {};
  }

  private buildTemplate(options: TemplateConfig): Template {
    const {
      id,
      name,
      components = [],
      children = [],
    } = options;

    const template = new Template({ id, name });

    children.forEach((child) => {
      const childTemplate = this.buildTemplate(child);
      childTemplate.parent = template;
      template.appendChild(childTemplate);
    });

    components.forEach((componentOptions) => {
      const Component = this.components[componentOptions.name];
      template.setComponent(new Component(componentOptions.config));
    });

    this.storage[options.id] = template;
    return template;
  }

  register(options: TemplateConfig): void {
    this.buildTemplate(options);
  }

  get(id: string): Template {
    if (!this.storage[id]) {
      throw new Error(`Can't find template with the following id: ${id}`);
    }

    return this.storage[id].clone();
  }

  getAll(): Template[] {
    return Object.values(this.storage);
  }

  delete(id: string): void {
    const template = this.get(id);
    template.children.forEach((child) => this.delete(child.id));

    delete this.storage[id];
  }
}

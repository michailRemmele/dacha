import type { TemplateConfig } from '../types';

interface CollectionEntry {
  config: TemplateConfig;
  parent?: TemplateConfig;
}

export class TemplateCollection {
  private storage: Map<string, CollectionEntry>;

  constructor() {
    this.storage = new Map();
  }

  register(template: TemplateConfig, parent?: TemplateConfig): void {
    this.storage.set(template.id, { config: template, parent });

    template.children.forEach((child) => {
      this.register(child, template);
    });
  }

  get(id: string): TemplateConfig {
    if (!this.storage.has(id)) {
      throw new Error(`Can't find template with the following id: ${id}`);
    }

    return this.storage.get(id)?.config as TemplateConfig;
  }

  getAll(onlyRoots?: boolean): TemplateConfig[] {
    const templates: TemplateConfig[] = [];

    this.storage.forEach((entry) => {
      if (onlyRoots) {
        if (!entry.parent) {
          templates.push(entry.config);
        }
      } else {
        templates.push(entry.config);
      }
    });

    return templates;
  }

  delete(id: string): void {
    const template = this.get(id);
    template.children.forEach((child) => this.delete(child.id));

    this.storage.delete(id);
  }
}

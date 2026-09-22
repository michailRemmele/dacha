import type { TemplateConfig } from '../types';

interface CollectionEntry {
  config: TemplateConfig;
  parent?: TemplateConfig;
}

/**
 * The actor templates of the game. Systems get it in `options.templateCollection`.
 *
 * @category Actors & Components
 */
export class TemplateCollection {
  private storage: Map<string, CollectionEntry>;

  /** @internal */
  constructor() {
    this.storage = new Map();
  }

  /**
   * Adds a template and its child templates.
   *
   * @internal
   */
  register(template: TemplateConfig, parent?: TemplateConfig): void {
    if (this.storage.has(template.id)) {
      throw new Error(
        `Template with the following id is already registered: ${template.id}`,
      );
    }

    this.storage.set(template.id, { config: template, parent });

    template.children.forEach((child) => {
      this.register(child, template);
    });
  }

  /**
   * Returns a template by its id. Child templates can be found by id too.
   *
   * @throws Error If there is no template with this id.
   */
  get(id: string): TemplateConfig {
    if (!this.storage.has(id)) {
      throw new Error(`Can't find template with the following id: ${id}`);
    }

    return this.storage.get(id)?.config as TemplateConfig;
  }

  /**
   * Returns all templates.
   *
   * @param onlyRoots - Returns only the top-level templates, without their children.
   */
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

  /**
   * Removes a template and its child templates.
   *
   * @internal
   */
  delete(id: string): void {
    const template = this.get(id);
    template.children.forEach((child) => this.delete(child.id));

    this.storage.delete(id);
  }
}

import uuid from 'uuid-random';

import type { ComponentConfig } from '../types';
import type { ComponentConstructor } from '../component';
import type {
  Template,
  TemplateCollection,
} from '../template';

import { Actor } from './actor';

export interface ActorOptions {
  id?: string
  name?: string
  children?: Array<ActorOptions>
  components?: Array<ComponentConfig>
  fromTemplate?: boolean
  templateId?: string
  isNew?: boolean
}

export class ActorCreator {
  private components: Record<string, ComponentConstructor>;
  private templateCollection: TemplateCollection;

  constructor(
    components: Array<ComponentConstructor>,
    templateCollection: TemplateCollection,
  ) {
    this.components = components.reduce((acc, ComponentClass) => {
      acc[ComponentClass.componentName] = ComponentClass;
      return acc;
    }, {} as Record<string, ComponentConstructor>);
    this.templateCollection = templateCollection;
  }

  private buildFromTemplate(options: ActorOptions, template: Template): Actor {
    const {
      templateId = void '',
      components = [],
      children = [],
      isNew = false,
    } = options;
    let { id, name } = options;

    id = id || uuid();
    name = name || id;

    if (!template) {
      throw new Error(`Can't create actor ${name} from template. `
        + `The template with id ${String(templateId)} is null.`);
    }

    const actor = new Actor({
      id,
      name,
      templateId,
    });

    if (isNew) {
      template.children.forEach((templateChild) => {
        const childOptions = {
          name: templateChild.name,
          templateId: templateChild.id,
          fromTemplate: true,
          isNew,
        };

        const actorChild = this.build(childOptions, templateChild);
        actor.appendChild(actorChild);
      });
    } else {
      const templateChildrenMap = template.children
        .reduce((storage: Record<string, Template>, templateChild) => {
          storage[templateChild.id] = templateChild;

          return storage;
        }, {});

      children.forEach((childOptions) => {
        const { templateId: childTemplateId, fromTemplate } = childOptions;

        const templateChild = fromTemplate
          ? templateChildrenMap[childTemplateId as string]
          : void 0;
        const actorChild = this.build(childOptions, templateChild);
        actor.appendChild(actorChild);
      });
    }

    template.getComponents().forEach((component) => {
      actor.setComponent(component);
    });

    components.forEach((componentOptions) => {
      const Component = this.components[componentOptions.name];
      actor.setComponent(new Component(componentOptions.config));
    });

    return actor;
  }

  private buildFromScratch(options: ActorOptions): Actor {
    const {
      name,
      components = [],
      children = [],
    } = options;
    let { id } = options;

    id = id || uuid();

    const actor = new Actor({
      id,
      name: name as string,
    });

    children.forEach((child) => {
      const actorChild = this.build(child);
      actor.appendChild(actorChild);
    });

    components.forEach((componentOptions) => {
      const Component = this.components[componentOptions.name];
      actor.setComponent(new Component(componentOptions.config));
    });

    return actor;
  }

  private build(options: ActorOptions, template?: Template): Actor {
    const { templateId, fromTemplate } = options;

    if (fromTemplate) {
      template = template || this.templateCollection.get(templateId as string);

      return this.buildFromTemplate(options, template);
    }

    return this.buildFromScratch(options);
  }

  create(options: ActorOptions): Actor {
    return this.build(options);
  }
}

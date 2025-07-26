import uuid from 'uuid-random';

import type { ComponentConfig } from '../types';
import type { ComponentConstructor } from '../component';
import type { TemplateCollection } from '../template';

import { Actor } from './actor';

export interface ActorOptions {
  id?: string
  name?: string
  children?: ActorOptions[]
  components?: ComponentConfig[]
  templateId?: string
  isNew?: boolean
}

export class ActorCreator {
  private components: Record<string, ComponentConstructor>;
  private templateCollection: TemplateCollection;

  constructor(
    components: ComponentConstructor[],
    templateCollection: TemplateCollection,
  ) {
    this.components = components.reduce((acc, ComponentClass) => {
      acc[ComponentClass.componentName] = ComponentClass;
      return acc;
    }, {} as Record<string, ComponentConstructor>);
    this.templateCollection = templateCollection;
  }

  private buildFromTemplate(options: ActorOptions): Actor {
    const {
      templateId,
      components = [],
      children = [],
      isNew = false,
    } = options;
    let { id, name } = options;

    id = id || uuid();
    name = name || id;

    const template = templateId ? this.templateCollection.get(templateId) : undefined;

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
          isNew,
        };

        const actorChild = this.build(childOptions);
        actor.appendChild(actorChild);
      });
    } else {
      children.forEach((childOptions) => {
        const actorChild = this.build(childOptions);
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

  private build(options: ActorOptions): Actor {
    const { templateId } = options;

    if (templateId) {
      return this.buildFromTemplate(options);
    }

    return this.buildFromScratch(options);
  }

  create(options: ActorOptions): Actor {
    return this.build(options);
  }
}

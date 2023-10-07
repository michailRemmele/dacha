import uuid from 'uuid-random';

import type { ComponentConfig } from '../types';
import type { Component } from '../component';
import type {
  Template,
  TemplateCollection,
} from '../template';
import type { Constructor } from '../../types/utils';

import { GameObject } from './game-object';

export interface GameObjectOptions {
  id?: string
  name?: string
  type?: string
  children?: Array<GameObjectOptions>
  components?: Array<ComponentConfig>
  fromTemplate?: boolean
  templateId?: string
  isNew?: boolean
}

export class GameObjectCreator {
  private components: Record<string, Constructor<Component>>;
  private templateCollection: TemplateCollection;

  constructor(
    components: Array<Constructor<Component>>,
    templateCollection: TemplateCollection,
  ) {
    this.components = components.reduce((acc, ComponentClass) => {
      acc[ComponentClass.name] = ComponentClass;
      return acc;
    }, {} as Record<string, Constructor<Component>>);
    this.templateCollection = templateCollection;
  }

  private buildFromTemplate(options: GameObjectOptions, template: Template): GameObject {
    const {
      type,
      templateId = void '',
      components = [],
      children = [],
      isNew = false,
    } = options;
    let { id, name } = options;

    id = id || uuid();
    name = name || id;

    if (!template) {
      throw new Error(`Can't create game object ${name} from template. `
        + `The template with id ${String(templateId)} is null.`);
    }

    const gameObject = new GameObject({
      id,
      name,
      type: type || template.type,
      templateId,
    });

    if (isNew) {
      template.getChildren().forEach((templateChild) => {
        const childOptions = {
          name: templateChild.name,
          templateId: templateChild.id,
          type: templateChild.type,
          fromTemplate: true,
          isNew,
        };

        const gameObjectChild = this.build(childOptions, templateChild);
        gameObject.appendChild(gameObjectChild);
      });
    } else {
      const templateChildrenMap = template.getChildren()
        .reduce((storage: Record<string, Template>, templateChild) => {
          storage[templateChild.id] = templateChild;

          return storage;
        }, {});

      children.forEach((childOptions) => {
        const { templateId: childTemplateId, fromTemplate } = childOptions;

        const templateChild = fromTemplate
          ? templateChildrenMap[childTemplateId as string]
          : void 0;
        const gameObjectChild = this.build(childOptions, templateChild);
        gameObject.appendChild(gameObjectChild);
      });
    }

    template.getComponents().forEach((component) => {
      gameObject.setComponent(component);
    });

    components.forEach((componentOptions) => {
      const Component = this.components[componentOptions.name];
      gameObject.setComponent(new Component(componentOptions.config));
    });

    return gameObject;
  }

  private buildFromScratch(options: GameObjectOptions): GameObject {
    const {
      name,
      type,
      components = [],
      children = [],
    } = options;
    let { id } = options;

    id = id || uuid();

    const gameObject = new GameObject({
      id,
      name: name as string,
      type,
    });

    children.forEach((child) => {
      const gameObjectChild = this.build(child);
      gameObject.appendChild(gameObjectChild);
    });

    components.forEach((componentOptions) => {
      const Component = this.components[componentOptions.name];
      gameObject.setComponent(new Component(componentOptions.config));
    });

    return gameObject;
  }

  private build(options: GameObjectOptions, template?: Template): GameObject {
    const { templateId, fromTemplate } = options;

    if (fromTemplate) {
      template = template || this.templateCollection.get(templateId as string);

      return this.buildFromTemplate(options, template);
    }

    return this.buildFromScratch(options);
  }

  create(options: GameObjectOptions): GameObject {
    return this.build(options);
  }
}

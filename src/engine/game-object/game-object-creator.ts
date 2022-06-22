import uuid from 'uuid-random';

import type { ComponentConfig } from '../types';
import type { Component } from '../component';
import type {
  Template,
  TemplateCollection,
} from '../template';

import { GameObject } from './game-object';

interface ComponentConstructor {
  new(name: ComponentConfig['name'], options: ComponentConfig['config']): Component
}

export interface GameObjectOptions {
  id?: string
  name?: string
  type?: string
  children?: Array<GameObjectOptions>
  components?: Array<ComponentConfig>
  fromTemplate?: boolean
  templateName?: string
  isNew?: boolean
}

export class GameObjectCreator {
  private components: Record<string, ComponentConstructor>;
  private templateCollection: TemplateCollection;

  constructor(
    components: Record<string, ComponentConstructor>,
    templateCollection: TemplateCollection,
  ) {
    this.components = components;
    this.templateCollection = templateCollection;
  }

  private buildFromTemplate(options: GameObjectOptions, template: Template): GameObject {
    const {
      type,
      templateName = '',
      components = [],
      children = [],
      isNew = false,
    } = options;
    let { id, name } = options;

    id = id || uuid();
    name = name || id;

    if (!template) {
      throw new Error(`Can't create game object ${name} from template. `
        + `The template ${templateName} is null.`);
    }

    const gameObject = new GameObject({
      id,
      name,
      type: type || template.getType(),
      templateName,
    });

    if (isNew) {
      template.getChildren().forEach((templateChild) => {
        const childOptions = {
          name: templateChild.getName(),
          templateName: templateChild.getName(),
          type: templateChild.getType(),
          fromTemplate: true,
          isNew,
        };

        const gameObjectChild = this.build(childOptions, templateChild);
        gameObject.appendChild(gameObjectChild);
      });
    } else {
      const templateChildrenMap = template.getChildren().reduce(
        (storage: Record<string, Template>, templateChild) => {
          storage[templateChild.getName()] = templateChild;

          return storage;
        }, {},
      );

      children.forEach((childOptions) => {
        const { templateName: childTemplateName, fromTemplate } = childOptions;

        const templateChild = fromTemplate
          ? templateChildrenMap[childTemplateName as string]
          : void 0;
        const gameObjectChild = this.build(childOptions, templateChild);
        gameObject.appendChild(gameObjectChild);
      });
    }

    template.getAvailableComponents().forEach((componentName) => {
      const component = template.getComponent(componentName);
      if (component) {
        gameObject.setComponent(componentName, component);
      }
    });

    components.forEach((componentOptions) => {
      const Component = this.components[componentOptions.name];
      gameObject.setComponent(
        componentOptions.name,
        new Component(componentOptions.name, componentOptions.config),
      );
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
      gameObject.setComponent(
        componentOptions.name,
        new Component(componentOptions.name, componentOptions.config),
      );
    });

    return gameObject;
  }

  private build(options: GameObjectOptions, template?: Template): GameObject {
    const { templateName, fromTemplate } = options;

    if (fromTemplate) {
      template = template || this.templateCollection.get(templateName as string);

      return this.buildFromTemplate(options, template);
    }

    return this.buildFromScratch(options);
  }

  create(options: GameObjectOptions): GameObject {
    return this.build(options);
  }
}

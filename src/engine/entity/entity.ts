import type { Component } from '../component';
import { filterByKey } from '../utils';

export interface ComponentsEditionEvent {
  type: 'COMPONENT_ADDED' | 'COMPONENT_REMOVED';
  componentName: string;
  entity: Entity;
}

export interface EntityOptions {
  id: string
  name: string
  prefabName?: string
  type?: string
}

export class Entity {
  private components: Record<string, Component>;
  private children: Array<Entity>;
  private subscribers: Array<(event: ComponentsEditionEvent) => void>;
  private childrenNames: Record<string, Entity>;
  private childrenIds: Record<string, Entity>;

  public readonly id: string;
  public name: string;
  public type?: string;
  public readonly prefabName?: string;
  public parent?: Entity;

  constructor({
    id,
    name,
    prefabName,
    type,
  }: EntityOptions) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.prefabName = prefabName;
    this.components = {};
    this.parent = void 0;
    this.children = [];
    this.childrenNames = {};
    this.childrenIds = {};

    this.subscribers = [];
  }

  getAncestor(): Entity {
    const findAncestor = (entity: Entity): Entity => {
      if (entity.parent) {
        return findAncestor(entity.parent);
      }

      return entity;
    };

    return findAncestor(this);
  }

  appendChild(child: Entity): void {
    this.children.push(child);
    child.parent = this;

    if (this.childrenIds[child.id]) {
      throw new Error(`Can't add child with id: ${child.id}. Child with same name already exists`);
    }
    this.childrenIds[child.id] = child;

    if (this.childrenNames[child.name]) {
      throw new Error(`Can't add child with name: ${child.name}. Child with same name already exists`);
    }
    this.childrenNames[child.name] = child;
  }

  removeChild(child: Entity): void {
    this.children = this.children.filter((entity) => entity.id !== child.id);
    child.parent = void 0;

    this.childrenIds = filterByKey(this.childrenIds, child.id);
    this.childrenNames = filterByKey(this.childrenNames, child.name);
  }

  getChildren(): Array<Entity> {
    return this.children;
  }

  getChildById(id: string): Entity | undefined {
    return this.childrenIds[id];
  }

  getChildByName(name: string): Entity | undefined {
    return this.childrenNames[name];
  }

  getId(): string {
    return this.id;
  }

  getComponentNamesList(): Array<string> {
    return Object.keys(this.components);
  }

  getComponent(name: string): Component {
    return this.components[name];
  }

  setComponent(name: string, component: Component): void {
    this.components[name] = component;
    component.entity = this;

    this.subscribers.forEach((callback) => {
      callback({
        type: 'COMPONENT_ADDED',
        componentName: name,
        entity: this,
      });
    });
  }

  removeComponent(name: string): void {
    if (!this.components[name]) {
      return;
    }

    this.components[name].entity = void 0;
    this.components = filterByKey(this.components, name);

    this.subscribers.forEach((callback) => {
      callback({
        type: 'COMPONENT_REMOVED',
        componentName: name,
        entity: this,
      });
    });
  }

  subscribe(callback: (event: ComponentsEditionEvent) => void): void {
    if (!(callback instanceof Function)) {
      throw new Error('On subscribe callback should be a function');
    }

    this.subscribers.push(callback);
  }

  clearSubscriptions(): void {
    this.subscribers = [];
  }
}

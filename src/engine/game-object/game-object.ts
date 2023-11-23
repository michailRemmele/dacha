import type { Component, ComponentConstructor } from '../component';
import { filterByKey } from '../utils';

export interface ComponentsEditionEvent {
  type: 'COMPONENT_ADDED' | 'COMPONENT_REMOVED';
  componentName: string;
  gameObject: GameObject;
}

export interface GameObjectOptions {
  id: string
  name: string
  templateId?: string
}

export class GameObject {
  private components: Record<string, Component>;
  private children: Array<GameObject>;
  private subscribers: Array<(event: ComponentsEditionEvent) => void>;
  private childrenIds: Record<string, GameObject>;

  public readonly id: string;
  public name: string;
  public readonly templateId?: string;
  public parent?: GameObject;

  constructor({
    id,
    name,
    templateId,
  }: GameObjectOptions) {
    this.id = id;
    this.name = name;
    this.templateId = templateId;
    this.components = {};
    this.parent = void 0;
    this.children = [];
    this.childrenIds = {};

    this.subscribers = [];
  }

  getAncestor(): GameObject {
    const findAncestor = (gameObject: GameObject): GameObject => {
      if (gameObject.parent) {
        return findAncestor(gameObject.parent);
      }

      return gameObject;
    };

    return findAncestor(this);
  }

  appendChild(child: GameObject): void {
    this.children.push(child);
    child.parent = this;

    if (this.childrenIds[child.id]) {
      throw new Error(`Can't add child with id: ${child.id}. Child with same name already exists`);
    }
    this.childrenIds[child.id] = child;
  }

  removeChild(child: GameObject): void {
    this.children = this.children.filter((gameObject) => gameObject.id !== child.id);
    child.parent = void 0;

    this.childrenIds = filterByKey(this.childrenIds, child.id);
  }

  getChildren(): Array<GameObject> {
    return this.children;
  }

  getChildById(id: string): GameObject | undefined {
    return this.childrenIds[id];
  }

  getChildrenByName(name: string): Array<GameObject> {
    return this.children.filter((gameObject) => gameObject.name === name);
  }

  getId(): string {
    return this.id;
  }

  getComponents(): Array<Component> {
    return Object.values(this.components);
  }

  getComponent<T extends Component = Component>(componentName: string): T;
  getComponent<T extends Component>(componentClass: ComponentConstructor<T>): T;
  getComponent<T extends Component>(classOrName: ComponentConstructor<T> | string): T {
    if (typeof classOrName === 'string') {
      return this.components[classOrName] as T;
    }
    return this.components[classOrName.componentName] as T;
  }

  setComponent(component: Component): void {
    const { componentName } = (component.constructor as ComponentConstructor);

    this.components[componentName] = component;
    component.gameObject = this;

    this.subscribers.forEach((callback) => {
      callback({
        type: 'COMPONENT_ADDED',
        componentName,
        gameObject: this,
      });
    });
  }

  removeComponent(componentClass: ComponentConstructor): void {
    const { componentName } = componentClass;

    if (!this.components[componentName]) {
      return;
    }

    this.components[componentName].gameObject = void 0;
    this.components = filterByKey(this.components, componentName);

    this.subscribers.forEach((callback) => {
      callback({
        type: 'COMPONENT_REMOVED',
        componentName,
        gameObject: this,
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

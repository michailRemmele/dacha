import { Component } from '../component';

interface ComponentsEditionEvent {
  type: 'COMPONENT_ADDED' | 'COMPONENT_REMOVED';
  componentName: string;
  gameObject: GameObject;
}

export class GameObject {
  private _id: string;
  private _components: Record<string, Component>;
  private _parent?: GameObject;
  private _children: Array<GameObject>;
  private _type?: string;
  private _subscribers: Array<(event: ComponentsEditionEvent) => void>;

  constructor(id: string) {
    this._id = id;
    this._components = {};
    this._parent = void 0;
    this._children = [];
    this._type = void 0;

    this._subscribers = [];
  }

  set parent(parent) {
    this._parent = parent;
  }

  get parent() {
    return this._parent;
  }

  getAncestor() {
    const findAncestor = (gameObject: GameObject): GameObject => {
      if (gameObject.parent) {
        return findAncestor(gameObject.parent);
      }

      return gameObject;
    };

    return findAncestor(this);
  }

  appendChild(child: GameObject) {
    this._children.push(child);
    child.parent = this;
  }

  removeChild(child: GameObject) {
    this._children = this._children.filter((gameObject) => gameObject.getId() !== child.getId());
    child.parent = void 0;
  }

  getChildren() {
    return this._children;
  }

  getId() {
    return this._id;
  }

  getComponentNamesList() {
    return Object.keys(this._components);
  }

  getComponent(name: string) {
    return this._components[name];
  }

  setComponent(name: string, component: Component) {
    this._components[name] = component;
    component.gameObject = this;

    this._subscribers.forEach((callback) => {
      callback({
        type: 'COMPONENT_ADDED',
        componentName: name,
        gameObject: this,
      });
    });
  }

  removeComponent(name: string) {
    if (!this._components[name]) {
      return;
    }

    this._components[name].gameObject = void 0;
    this._components = Object.keys(this._components)
      .reduce((acc: Record<string, Component>, key) => {
        if (key !== name) {
          acc[key] = this._components[key];
        }

        return acc;
      }, {});

    this._subscribers.forEach((callback) => {
      callback({
        type: 'COMPONENT_REMOVED',
        componentName: name,
        gameObject: this,
      });
    });
  }

  getType() {
    return this._type;
  }

  setType(type: string) {
    this._type = type;
  }

  subscribe(callback: (event: ComponentsEditionEvent) => void) {
    if (!(callback instanceof Function)) {
      throw new Error('On subscribe callback should be a function');
    }

    this._subscribers.push(callback);
  }

  clearSubscriptions() {
    this._subscribers = [];
  }
}

import { EventTarget } from '../event-target';
import { AddChildObject, RemoveChildObject } from '../events';

import { findObject } from './utils';

export interface BaseObjectOptions {
  id: string
  name: string
}

export class BaseObject extends EventTarget {
  public readonly id: string;
  public readonly name: string;
  public readonly children: Array<BaseObject>;

  declare public parent: BaseObject | null;

  constructor({ id, name }: BaseObjectOptions) {
    super();

    this.id = id;
    this.name = name;
    this.children = [];
  }

  appendChild(child: BaseObject): void {
    child.parent = this;
    this.children.push(child);

    this.emit(AddChildObject, { child });
  }

  removeChild(child: BaseObject): void {
    const index = this.children.findIndex((currentChild) => currentChild === child);
    if (index === -1) {
      return;
    }

    child.parent = null;
    this.children.splice(index, 1);

    this.emit(RemoveChildObject, { child });
  }

  remove(): void {
    if (this.parent === null) {
      return;
    }

    this.parent.removeChild(this);
  }

  getObjectById(id: string): BaseObject | undefined {
    return findObject(this, (object) => object.id === id);
  }

  getObjectByName(name: string): BaseObject | undefined {
    return findObject(this, (object) => object.name === name);
  }
}

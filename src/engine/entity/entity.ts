import { EventTarget } from '../event-target';
import { AddChildEntity, RemoveChildEntity } from '../events';

import { findChild } from './utils';

export interface EntityOptions {
  id: string
  name: string
}

export class Entity extends EventTarget {
  public readonly id: string;
  public readonly name: string;
  public children: Array<Entity>;

  declare public parent: Entity | null;

  constructor({ id, name }: EntityOptions) {
    super();

    this.id = id;
    this.name = name;
    this.children = [];
  }

  appendChild(child: Entity): void {
    child.parent = this;
    this.children.push(child);

    this.dispatchEventImmediately(AddChildEntity, { child });
  }

  removeChild(child: Entity): void {
    const index = this.children.findIndex((currentChild) => currentChild === child);
    if (index === -1) {
      return;
    }

    child.parent = null;
    this.children.splice(index, 1);

    this.dispatchEventImmediately(RemoveChildEntity, { child });
  }

  remove(): void {
    if (this.parent === null) {
      return;
    }

    this.parent.removeChild(this);
  }

  findChild(predicate: (entity: Entity) => boolean, recursive = true): Entity | undefined {
    return findChild(this, predicate, recursive);
  }

  findChildById(id: string, recursive = true): Entity | undefined {
    return this.findChild((entity) => entity.id === id, recursive);
  }

  findChildByName(name: string, recursive = true): Entity | undefined {
    return this.findChild((entity) => entity.name === name, recursive);
  }
}

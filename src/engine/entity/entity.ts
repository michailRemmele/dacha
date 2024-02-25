import { EventTarget } from '../event-target';
import { AddChildEntity, RemoveChildEntity } from '../events';

import { findEntity } from './utils';

export interface EntityOptions {
  id: string
  name: string
}

export class Entity extends EventTarget {
  public readonly id: string;
  public readonly name: string;
  public readonly children: Array<Entity>;

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

    this.emit(AddChildEntity, { child });
  }

  removeChild(child: Entity): void {
    const index = this.children.findIndex((currentChild) => currentChild === child);
    if (index === -1) {
      return;
    }

    child.parent = null;
    this.children.splice(index, 1);

    this.emit(RemoveChildEntity, { child });
  }

  remove(): void {
    if (this.parent === null) {
      return;
    }

    this.parent.removeChild(this);
  }

  getEntityById(id: string): Entity | undefined {
    return findEntity(this, (entity) => entity.id === id);
  }

  getEntityByName(name: string): Entity | undefined {
    return findEntity(this, (entity) => entity.name === name);
  }
}

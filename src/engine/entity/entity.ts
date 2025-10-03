import { EventTarget } from '../event-target';
import { AddChildEntity, RemoveChildEntity } from '../events';

import { findChild } from './utils';

/**
 * Options for creating a new entity.
 */
export interface EntityOptions {
  /** Id of the entity */
  id: string;
  /** Name of the entity */
  name: string
}

/**
 * Base class for all entities.
 * 
 * @category Core
 */
export class Entity extends EventTarget {
  /** Id of the entity */
  public readonly id: string;
  /** Name of the entity */
  public readonly name: string;
  /** Children of the entity */
  public children: Entity[];

  /** Parent of the entity */
  declare public parent: Entity | null;

  /**
   * Creates a new entity.
   *
   * @param options - Options for the entity
   */
  constructor({ id, name }: EntityOptions) {
    super();

    this.id = id;
    this.name = name;
    this.children = [];
  }

  /**
   * Adds a child to the entity.
   *
   * @param child - Child to add
   */
  appendChild(child: Entity): void {
    child.parent = this;
    this.children.push(child);

    this.dispatchEventImmediately(AddChildEntity, { child });
  }

  /**
   * Removes a child from the entity.
   *
   * @param child - Child to remove
   */
  removeChild(child: Entity): void {
    const index = this.children.findIndex((currentChild) => currentChild === child);
    if (index === -1) {
      return;
    }

    child.parent = null;
    this.children.splice(index, 1);

    this.dispatchEventImmediately(RemoveChildEntity, { child });
  }

  /**
   * Removes the entity from its parent.
   */
  remove(): void {
    if (this.parent === null) {
      return;
    }

    this.parent.removeChild(this);
  }

  /**
   * Finds a child entity by a predicate function.
   *
   * @param predicate - A function that runs on each child entity
   * and should return true if the child entity matches the predicate or false otherwise
   * @param recursive - Whether to search recursively through the children
   * @returns Child entity or undefined
   */
  findChild(predicate: (entity: Entity) => boolean, recursive = true): Entity | undefined {
    return findChild(this, predicate, recursive);
  }

  /**
   * Finds a child entity by its id.
   *
   * @param id - Id of the child entity
   * @param recursive - Whether to search recursively through the children
   * @returns Child entity or undefined
   */
  findChildById(id: string, recursive = true): Entity | undefined {
    return this.findChild((entity) => entity.id === id, recursive);
  }

  /**
   * Finds a child entity by its name.
   *
   * @param name - Name of the child entity
   * @param recursive - Whether to search recursively through the children
   * @returns Child entity or undefined
   */
  findChildByName(name: string, recursive = true): Entity | undefined {
    return this.findChild((entity) => entity.name === name, recursive);
  }
}

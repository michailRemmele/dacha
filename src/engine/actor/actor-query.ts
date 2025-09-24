import { EventTarget } from '../event-target';
import type { EventType, Event, ListenerFn } from '../event-target';
import {
  AddComponent,
  RemoveComponent,
  AddActor,
  RemoveActor,
  AddChildEntity,
  RemoveChildEntity,
} from '../events';
import type {
  AddChildEntityEvent,
  RemoveChildEntityEvent,
  AddComponentEvent,
  RemoveComponentEvent,
  ActorCollectionEventMap,
} from '../events';
import type { Scene } from '../scene';
import type { ComponentConstructor } from '../component';
import { traverseEntity } from '../entity';

import { Actor } from './actor';

type ActorQueryListenerFn<T extends EventType> = (
  event: T extends keyof ActorCollectionEventMap
    ? ActorCollectionEventMap[T]
    : Event,
) => void;

export type ActorQueryFilter =
  | (ComponentConstructor | string)[]
  | ((actor: Actor) => boolean);

export interface ActorQueryOptions {
  scene: Scene;
  filter: ActorQueryFilter;
}

export class ActorQuery extends EventTarget {
  private scene: Scene;
  private filter: ActorQueryFilter;

  private matchedActors: Set<Actor>;

  constructor(options: ActorQueryOptions) {
    super();

    const { scene, filter } = options;

    this.scene = scene;
    this.filter = filter;

    this.matchedActors = new Set();

    traverseEntity<Scene | Actor>(scene, (entity) => {
      if (entity instanceof Actor && this.test(entity)) {
        this.matchedActors.add(entity);
      }
    });

    scene.addEventListener(AddChildEntity, this.handleAddChildEntity);
    scene.addEventListener(RemoveChildEntity, this.handleRemoveChildEntity);
    scene.addEventListener(AddComponent, this.handleActorUpdate);
    scene.addEventListener(RemoveComponent, this.handleActorUpdate);
  }

  destroy(): void {
    this.scene.removeEventListener(AddChildEntity, this.handleAddChildEntity);
    this.scene.removeEventListener(
      RemoveChildEntity,
      this.handleRemoveChildEntity,
    );
    this.scene.removeEventListener(AddComponent, this.handleActorUpdate);
    this.scene.removeEventListener(RemoveComponent, this.handleActorUpdate);
  }

  override addEventListener<T extends EventType>(
    type: T,
    callback: ActorQueryListenerFn<T>,
  ): void {
    super.addEventListener(type, callback as ListenerFn);
  }

  override removeEventListener<T extends EventType>(
    type: T,
    callback: ActorQueryListenerFn<T>,
  ): void {
    super.removeEventListener(type, callback as ListenerFn);
  }

  private handleAddChildEntity = (event: AddChildEntityEvent): void => {
    traverseEntity(event.child, (entity) => {
      if (entity instanceof Actor && this.test(entity)) {
        this.add(entity);
      }
    });
  };

  private handleRemoveChildEntity = (event: RemoveChildEntityEvent): void => {
    traverseEntity(event.child, (entity) => {
      if (entity instanceof Actor) {
        this.delete(entity as Actor);
      }
    });
  };

  private handleActorUpdate = (
    event: AddComponentEvent | RemoveComponentEvent,
  ): void => {
    const { target } = event;

    if (this.test(target)) {
      this.add(target);
    } else {
      this.delete(target);
    }
  };

  private test(actor: Actor): boolean {
    if (typeof this.filter === 'function') {
      return this.filter(actor);
    }

    return this.filter.every((component) => {
      return actor.getComponent(component);
    });
  }

  private add(actor: Actor): void {
    if (this.matchedActors.has(actor)) {
      return;
    }

    this.matchedActors.add(actor);

    this.dispatchEventImmediately(AddActor, { actor });
  }

  private delete(actor: Actor): void {
    if (!this.matchedActors.has(actor)) {
      return;
    }

    this.matchedActors.delete(actor);

    this.dispatchEventImmediately(RemoveActor, { actor });
  }

  getActors(): Set<Actor> {
    return this.matchedActors;
  }
}

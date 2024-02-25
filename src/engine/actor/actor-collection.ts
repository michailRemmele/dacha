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
  AddComponentEvent,
  RemoveComponentEvent,
  ActorCollectionEventMap,
} from '../events';
import type { Scene } from '../scene';
import type { ComponentConstructor } from '../component';
import { traverseEntity } from '../entity';

import { Actor } from './actor';

type ActorCollectionListenerFn<T extends EventType> = (
  event: T extends keyof ActorCollectionEventMap ? ActorCollectionEventMap[T] : Event
) => void;

export interface ActorCollectionFilter {
  components?: Array<ComponentConstructor | string>;
}

export class ActorCollection extends EventTarget {
  private components: Array<ComponentConstructor | string>;
  private acceptedActors: Array<Actor>;
  private acceptedActorsMap: Record<string, Actor | undefined>;

  constructor(scene: Scene, filter: ActorCollectionFilter = {}) {
    super();

    const {
      components = [],
    } = filter;

    this.components = components;

    this.acceptedActorsMap = {};
    this.acceptedActors = [];

    traverseEntity<Scene | Actor>(scene, (entity) => {
      if (entity instanceof Actor && this.test(entity)) {
        this.acceptedActorsMap[entity.id] = entity;
        this.acceptedActors.push(entity);
      }
    });

    scene.addEventListener(AddChildEntity, (event) => {
      traverseEntity(event.child, (entity) => this.add(entity as Actor));
    });
    scene.addEventListener(RemoveChildEntity, (event) => {
      traverseEntity(event.child, (entity) => this.remove(entity as Actor));
    });
    scene.addEventListener(AddComponent, this.handleActorUpdate);
    scene.addEventListener(RemoveComponent, this.handleActorUpdate);
  }

  override addEventListener<T extends EventType>(
    type: T,
    callback: ActorCollectionListenerFn<T>,
  ): void {
    super.addEventListener(type, callback as ListenerFn);
  }

  override removeEventListener<T extends EventType>(
    type: T,
    callback: ActorCollectionListenerFn<T>,
  ): void {
    super.removeEventListener(type, callback as ListenerFn);
  }

  private handleActorUpdate = (event: AddComponentEvent | RemoveComponentEvent): void => {
    const { target } = event;

    if (this.test(target)) {
      this.accept(target);
    } else {
      this.decline(target);
    }
  };

  private add(actor: Actor): void {
    if (this.test(actor)) {
      this.accept(actor);
    }
  }

  private remove(actor: Actor): void {
    if (!this.acceptedActorsMap[actor.id]) {
      return;
    }

    this.acceptedActors = this.acceptedActors.filter(
      (acceptedActor) => actor.id !== acceptedActor.id,
    );
    delete this.acceptedActorsMap[actor.id];

    this.emit(RemoveActor, { actor });
  }

  private test(actor: Actor): boolean {
    return this.components.every((component) => {
      // Dummy check to avoid typescript error
      if (typeof component === 'string') {
        return actor.getComponent(component);
      }
      return actor.getComponent(component);
    });
  }

  private accept(actor: Actor): void {
    if (this.acceptedActorsMap[actor.id]) {
      return;
    }

    this.acceptedActors.push(actor);
    this.acceptedActorsMap[actor.id] = actor;

    this.emit(AddActor, { actor });
  }

  private decline(actor: Actor): void {
    if (!this.acceptedActorsMap[actor.id]) {
      return;
    }

    this.acceptedActors = this.acceptedActors.filter(
      (acceptedActor) => actor.id !== acceptedActor.id,
    );
    delete this.acceptedActorsMap[actor.id];

    this.emit(RemoveActor, { actor });
  }

  get size(): number {
    return this.acceptedActors.length;
  }

  getById(id: string): Actor | undefined {
    return this.acceptedActorsMap[id];
  }

  forEach(callback: (actor: Actor, index: number) => void): void {
    this.acceptedActors.forEach(callback);
  }

  sort(compareFunction: (a: Actor, b: Actor) => number): void {
    this.acceptedActors.sort(compareFunction);
  }
}

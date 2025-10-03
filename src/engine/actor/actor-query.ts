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

/**
 * Filter type for ActorQuery that can match actors by components or custom logic.
 *
 * @example
 * // Match actors with specific components
 * const filter = [Transform, Sprite];
 *
 * // Match actors with custom logic
 * const filter = (actor) => actor.getComponent(Transform)?.offsetY > 100;
 */
export type ActorQueryFilter =
  | (ComponentConstructor | string)[]
  | ((actor: Actor) => boolean);

/**
 * Configuration options for creating an ActorQuery.
 */
export interface ActorQueryOptions {
  /** Scene to query actors from */
  scene: Scene;
  /** Filter criteria to match actors */
  filter: ActorQueryFilter;
}

/**
 * A query system that automatically tracks actors matching specific criteria.
 *
 * ActorQuery provides real-time filtering and tracking of actors in a scene based on
 * component presence or custom logic. It automatically updates when actors are added,
 * removed, or have components added/removed.
 *
 * @example
 * ```typescript
 * // Query all actors with Transform and Sprite components
 * const query = new ActorQuery({
 *   scene: myScene,
 *   filter: [Transform, Sprite]
 * });
 *
 * // Listen for actors being added to the query
 * query.addEventListener(AddActor, ({ actor }) => {
 *   console.log('New actor added:', actor.name);
 * });
 *
 * // Get all currently matching actors
 * const actors = query.getActors();
 * 
 * for (const actor of actors) {
 *   console.log('Actor:', actor.name);
 * }
 * ```
 * 
 * @category Core
 */
export class ActorQuery extends EventTarget {
  private scene: Scene;
  private filter: ActorQueryFilter;

  private matchedActors: Set<Actor>;

  /**
   * Creates a new ActorQuery instance.
   *
   * @param options - Configuration for the query
   */
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

  /**
   * Destroys the query and removes all event listeners.
   *
   * Call this method when the query is no longer needed to prevent memory leaks.
   */
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

  /**
   * Gets all actors currently matching the query criteria.
   *
   * @returns A Set of all actors that match the query filter
   *
   * @example
   * ```typescript
   * const query = new ActorQuery({
   *   scene: myScene,
   *   filter: [Transform, Sprite]
   * });
   *
   * // Get all matching actors
   * const actors = query.getActors();
   * console.log(`Found ${actors.size} actors with Transform and Sprite`);
   * ```
   */
  getActors(): Set<Actor> {
    return this.matchedActors;
  }
}

import type { Scene } from '../scene';
import type { Component, ComponentConstructor } from '../component';
import type { ActorEventMap } from '../../types/events';
import { AddComponent, RemoveComponent } from '../events';
import { Entity } from '../entity';
import type { EntityOptions } from '../entity';
import type {
  EventType,
  Event,
  ListenerFn,
  EventPayload,
} from '../event-target';
import { Transform } from '../../contrib/components/transform';

type ActorListenerFn<T extends EventType> = (
  event: T extends keyof ActorEventMap ? ActorEventMap[T] : Event,
) => void;

/**
 * Configuration options for creating an Actor.
 */
export interface ActorOptions extends EntityOptions {
  /** Optional template ID to instantiate from */
  templateId?: string;
}

/**
 * An Actor is the main entity type in the game engine.
 *
 * Actors are entities that can have components attached to them
 * and represent various game objects such as players, enemies, items, decorations, etc.
 * They support hierarchical relationships and can be organized in parent-child structures.
 *
 * @category Core
 */
export class Actor extends Entity {
  private components: Record<string, Component>;

  declare public readonly children: Actor[];
  /** The template id of the actor */
  public readonly templateId?: string;

  declare public parent: Actor | Scene | null;

  /**
   * Creates a new Actor instance.
   *
   * @param options - Configuration options for the actor
   */
  constructor(options: ActorOptions) {
    super(options);

    const { templateId } = options;

    this.templateId = templateId;

    const transform = new Transform({
      offsetX: 0,
      offsetY: 0,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    });
    transform.actor = this;

    this.components = {
      [Transform.componentName]: transform,
    };
  }

  override addEventListener<T extends EventType>(
    type: T,
    callback: ActorListenerFn<T>,
  ): void {
    super.addEventListener(type, callback as ListenerFn);
  }

  override removeEventListener<T extends EventType>(
    type: T,
    callback: ActorListenerFn<T>,
  ): void {
    super.removeEventListener(type, callback as ListenerFn);
  }

  override dispatchEvent<T extends EventType>(
    type: T,
    ...payload: EventPayload<ActorEventMap, T>
  ): void {
    super.dispatchEvent(type, ...payload);
  }

  override dispatchEventImmediately<T extends EventType>(
    type: T,
    ...payload: EventPayload<ActorEventMap, T>
  ): void {
    super.dispatchEventImmediately(type, ...payload);
  }

  override appendChild(child: Actor): void {
    super.appendChild(child);
  }

  override removeChild(child: Actor): void {
    super.removeChild(child);
  }

  override findChild(
    predicate: (child: Actor) => boolean,
    recursive = true,
  ): Actor | undefined {
    return super.findChild(
      predicate as (child: Entity) => boolean,
      recursive,
    ) as Actor | undefined;
  }

  override findChildById(id: string, recursive = true): Actor | undefined {
    return super.findChildById(id, recursive) as Actor | undefined;
  }

  override findChildByName(name: string, recursive = true): Actor | undefined {
    return super.findChildByName(name, recursive) as Actor | undefined;
  }

  /**
   * Gets all components attached to this actor.
   *
   * @returns An array of all components
   */
  getComponents(): Component[] {
    return Object.values(this.components);
  }

  /**
   * Gets a specific component from this actor.
   *
   * @param classOrName - The component class or component name string
   * @returns The component instance, or undefined if not found
   *
   * @example
   * ```typescript
   * // Get by class
   * const transform = actor.getComponent(Transform);
   *
   * // Get by name
   * const sprite = actor.getComponent('Sprite');
   *
   * // Type-safe access
   * if (transform) {
   *   transform.world.position.x = 100;
   * }
   * ```
   */
  getComponent<T extends Component>(
    classOrName: ComponentConstructor<T> | string,
  ): T {
    if (typeof classOrName === 'string') {
      return this.components[classOrName] as T;
    }
    return this.components[classOrName.componentName] as T;
  }

  /**
   * Attaches a component to this actor.
   *
   * @param component - The component to attach
   *
   * @example
   * ```typescript
   * const transform = new Transform({
   *   offsetX: 100,
   *   offsetY: 200,
   *   rotation: 0,
   *   scaleX: 1,
   *   scaleY: 1
   * });
   * actor.setComponent(transform);
   * ```
   */
  setComponent(component: Component): void {
    const { componentName } = component.constructor as ComponentConstructor;

    if (this.components[componentName]) {
      this.removeComponent(component.constructor as ComponentConstructor);
    }

    this.components[componentName] = component;
    component.actor = this;

    this.dispatchEventImmediately(AddComponent, {
      name: componentName,
      component,
    });
  }

  /**
   * Removes a component from this actor.
   *
   * @param componentClass - The component class to remove
   *
   * @example
   * ```typescript
   * actor.removeComponent(Transform);
   * ```
   */
  removeComponent(componentClass: ComponentConstructor): void {
    const { componentName } = componentClass;

    if (!this.components[componentName]) {
      return;
    }

    const deletedComponent = this.components[componentName];

    this.components[componentName].actor = undefined;
    delete this.components[componentName];

    this.dispatchEventImmediately(RemoveComponent, {
      name: componentName,
      component: deletedComponent,
    });
  }
}

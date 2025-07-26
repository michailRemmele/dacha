import type { Scene } from '../scene';
import type { Component, ComponentConstructor } from '../component';
import type { ActorEventMap } from '../../types/events';
import { AddComponent, RemoveComponent } from '../events';
import { Entity } from '../entity';
import type { EntityOptions } from '../entity';
import type {
  EventType, Event, ListenerFn, EventPayload,
} from '../event-target';

type ActorListenerFn<T extends EventType> = (
  event: T extends keyof ActorEventMap ? ActorEventMap[T] : Event
) => void;

export interface ActorOptions extends EntityOptions {
  templateId?: string
}

export class Actor extends Entity {
  private components: Record<string, Component>;

  declare public readonly children: Actor[];
  public readonly templateId?: string;

  declare public parent: Actor | Scene | null;

  constructor(options: ActorOptions) {
    super(options);

    const { templateId } = options;

    this.templateId = templateId;
    this.components = {};
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

  override findChild(predicate: (child: Actor) => boolean, recursive = true): Actor | undefined {
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

  getComponents(): Component[] {
    return Object.values(this.components);
  }

  getComponent<T extends Component>(classOrName: ComponentConstructor<T> | string): T {
    if (typeof classOrName === 'string') {
      return this.components[classOrName] as T;
    }
    return this.components[classOrName.componentName] as T;
  }

  setComponent(component: Component): void {
    const { componentName } = (component.constructor as ComponentConstructor);

    this.components[componentName] = component;
    component.actor = this;

    this.dispatchEventImmediately(AddComponent, { componentName });
  }

  removeComponent(componentClass: ComponentConstructor): void {
    const { componentName } = componentClass;

    if (!this.components[componentName]) {
      return;
    }

    this.components[componentName].actor = void 0;
    delete this.components[componentName];

    this.dispatchEventImmediately(RemoveComponent, { componentName });
  }
}

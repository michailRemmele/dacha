import type { Scene } from '../scene';
import type { Component, ComponentConstructor } from '../component';
import { filterByKey } from '../utils';
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

  declare public readonly children: Array<Actor>;
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

  override emit<T extends EventType>(
    type: T,
    ...payload: EventPayload<ActorEventMap, T>
  ): void {
    super.emit(type, ...payload);
  }

  override appendChild(child: Actor): void {
    super.appendChild(child);
  }

  override removeChild(child: Actor): void {
    super.removeChild(child);
  }

  override getEntityById(id: string): Actor | undefined {
    return super.getEntityById(id) as Actor | undefined;
  }

  override getEntityByName(name: string): Actor | undefined {
    return super.getEntityByName(name) as Actor | undefined;
  }

  getAncestor(): Actor | Scene {
    const findAncestor = (actor: Actor | Scene): Actor | Scene => {
      if (actor.parent) {
        return findAncestor(actor.parent);
      }

      return actor;
    };

    return findAncestor(this);
  }

  getComponents(): Array<Component> {
    return Object.values(this.components);
  }

  getComponent<T extends Component = Component>(componentName: string): T;
  getComponent<T extends Component>(componentClass: ComponentConstructor<T>): T;
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

    this.emit(AddComponent, { componentName });
  }

  removeComponent(componentClass: ComponentConstructor): void {
    const { componentName } = componentClass;

    if (!this.components[componentName]) {
      return;
    }

    this.components[componentName].actor = void 0;
    this.components = filterByKey(this.components, componentName);

    this.emit(RemoveComponent, { componentName });
  }
}

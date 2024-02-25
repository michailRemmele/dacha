import type { Scene } from '../scene';
import type { Component, ComponentConstructor } from '../component';
import { filterByKey } from '../utils';
import type { GameObjectEventMap } from '../../types/events';
import { AddComponent, RemoveComponent } from '../events';
import { BaseObject } from '../base-object';
import type { BaseObjectOptions } from '../base-object';
import type {
  EventType, Event, ListenerFn, EventPayload,
} from '../event-target';

type GameObjectListenerFn<T extends EventType> = (
  event: T extends keyof GameObjectEventMap ? GameObjectEventMap[T] : Event
) => void;

export interface GameObjectOptions extends BaseObjectOptions {
  templateId?: string
}

export class GameObject extends BaseObject {
  private components: Record<string, Component>;

  declare public readonly children: Array<GameObject>;
  public readonly templateId?: string;

  declare public parent: GameObject | Scene | null;

  constructor(options: GameObjectOptions) {
    super(options);

    const { templateId } = options;

    this.templateId = templateId;
    this.components = {};
  }

  override addEventListener<T extends EventType>(
    type: T,
    callback: GameObjectListenerFn<T>,
  ): void {
    super.addEventListener(type, callback as ListenerFn);
  }

  override removeEventListener<T extends EventType>(
    type: T,
    callback: GameObjectListenerFn<T>,
  ): void {
    super.removeEventListener(type, callback as ListenerFn);
  }

  override emit<T extends EventType>(
    type: T,
    ...payload: EventPayload<GameObjectEventMap, T>
  ): void {
    super.emit(type, ...payload);
  }

  override appendChild(child: GameObject): void {
    super.appendChild(child);
  }

  override removeChild(child: GameObject): void {
    super.removeChild(child);
  }

  override getObjectById(id: string): GameObject | undefined {
    return super.getObjectById(id) as GameObject | undefined;
  }

  override getObjectByName(name: string): GameObject | undefined {
    return super.getObjectByName(name) as GameObject | undefined;
  }

  getAncestor(): GameObject | Scene {
    const findAncestor = (gameObject: GameObject | Scene): GameObject | Scene => {
      if (gameObject.parent) {
        return findAncestor(gameObject.parent);
      }

      return gameObject;
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
    component.gameObject = this;

    this.emit(AddComponent, { componentName });
  }

  removeComponent(componentClass: ComponentConstructor): void {
    const { componentName } = componentClass;

    if (!this.components[componentName]) {
      return;
    }

    this.components[componentName].gameObject = void 0;
    this.components = filterByKey(this.components, componentName);

    this.emit(RemoveComponent, { componentName });
  }
}

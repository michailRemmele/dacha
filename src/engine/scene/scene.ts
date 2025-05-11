import type { SceneConfig } from '../types';
import type { TemplateCollection } from '../template';
import {
  Actor,
  ActorSpawner,
  ActorCreator,
} from '../actor';
import { Entity } from '../entity';
import type { EntityOptions } from '../entity';
import type {
  EventType, Event, ListenerFn, EventPayload,
} from '../event-target';
import type { SceneEventMap, ActorEventMap } from '../../types/events';

type SceneObjectListenerFn<T extends EventType> = (
  event: T extends keyof SceneEventMap
    ? SceneEventMap[T]
    : T extends keyof ActorEventMap ? ActorEventMap[T] : Event
) => void;

interface SceneOptions extends EntityOptions, SceneConfig {
  actorCreator: ActorCreator
  templateCollection: TemplateCollection
}

export class Scene extends Entity {
  private actorCreator: ActorCreator;

  declare readonly children: Actor[];
  templateCollection: TemplateCollection;
  actorSpawner: ActorSpawner;
  data: Record<string, unknown>;

  declare parent: null;

  constructor(options: SceneOptions) {
    super(options);

    const {
      actors,
      actorCreator,
      templateCollection,
    } = options;

    this.actorCreator = actorCreator;
    this.actorSpawner = new ActorSpawner(this.actorCreator);
    this.templateCollection = templateCollection;

    this.data = {};

    actors.forEach((actorOptions) => {
      this.appendChild(this.actorCreator.create(actorOptions));
    });
  }

  override addEventListener<T extends EventType>(
    type: T,
    callback: SceneObjectListenerFn<T>,
  ): void {
    super.addEventListener(type, callback as ListenerFn);
  }

  override removeEventListener<T extends EventType>(
    type: T,
    callback: SceneObjectListenerFn<T>,
  ): void {
    super.removeEventListener(type, callback as ListenerFn);
  }

  override dispatchEvent<T extends EventType>(
    type: T,
    ...payload: EventPayload<SceneEventMap, T>
  ): void {
    super.dispatchEvent(type, ...payload);
  }

  override dispatchEventImmediately<T extends EventType>(
    type: T,
    ...payload: EventPayload<SceneEventMap, T>
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
}

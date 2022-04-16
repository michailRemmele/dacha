import type { Entity, EntityObserver } from '../../../engine/entity';
import type { MessageBus } from '../../../engine/message-bus';
import type { Store } from '../../../engine/scene';

export interface ScriptOptions {
  entity: Entity
  messageBus: MessageBus
  store: Store
  entityObserver: EntityObserver
  spawner: unknown
  destroyer: unknown
}

export interface Script {
  update(deltaTime: number): void
}

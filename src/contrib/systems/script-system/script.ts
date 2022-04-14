import type { GameObject, GameObjectObserver } from '../../../engine/gameObject';
import type { MessageBus } from '../../../engine/message-bus';
import type { Store } from '../../../engine/scene';

export interface ScriptOptions {
  gameObject: GameObject
  messageBus: MessageBus
  store: Store
  gameObjectObserver: GameObjectObserver
  spawner: unknown
  destroyer: unknown
}

export interface Script {
  update(deltaTime: number): void
}

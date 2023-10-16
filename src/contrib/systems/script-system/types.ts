import type { GameObject, GameObjectObserver } from '../../../engine/game-object';
import type { MessageBus } from '../../../engine/message-bus';
import type { Store } from '../../../engine/scene';

export interface GameObjectScriptOptions {
  gameObject: GameObject
  messageBus: MessageBus
  store: Store
  gameObjectObserver: GameObjectObserver
  spawner: unknown
  destroyer: unknown
}

export interface GameObjectScript {
  update(deltaTime: number): void
}

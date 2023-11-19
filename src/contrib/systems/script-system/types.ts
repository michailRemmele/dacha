import type { GameObject, GameObjectObserver } from '../../../engine/game-object';
import type { MessageBus } from '../../../engine/message-bus';

export interface GameObjectScriptOptions {
  gameObject: GameObject
  messageBus: MessageBus
  gameObjectObserver: GameObjectObserver
  spawner: unknown
  destroyer: unknown
}

export interface GameObjectScript {
  update(deltaTime: number): void
}

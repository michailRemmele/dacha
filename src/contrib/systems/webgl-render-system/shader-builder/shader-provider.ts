import { AddGameObject, RemoveGameObject } from '../../../../engine/events';
import type { UpdateGameObjectEvent } from '../../../../engine/events';
import type {
  GameObjectObserver,
  GameObject,
} from '../../../../engine/game-object';
import { Renderable } from '../../../components/renderable';

export class ShaderProvider {
  private gameObjectObserver: GameObjectObserver;
  private shadingIdMap: Record<string, string>;

  constructor(gameObjectObserver: GameObjectObserver) {
    this.gameObjectObserver = gameObjectObserver;

    this.shadingIdMap = {};

    // TODO: Remove listeners on system unmount
    this.gameObjectObserver.addEventListener(AddGameObject, this.handleGameObjectAdd);
    this.gameObjectObserver.addEventListener(RemoveGameObject, this.handleGameObjectRemove);
  }

  getShadingId(gameObjectId: string): string {
    return this.shadingIdMap[gameObjectId];
  }

  private handleGameObjectAdd = (event: UpdateGameObjectEvent): void => {
    const { gameObject } = event;
    this.shadingIdMap[gameObject.id] = this.calculateShadingId(gameObject);
  };

  private handleGameObjectRemove = (event: UpdateGameObjectEvent): void => {
    const { gameObject } = event;
    this.shadingIdMap = Object.keys(this.shadingIdMap)
      .reduce((acc: Record<string, string>, key) => {
        if (key !== gameObject.id) {
          acc[key] = this.shadingIdMap[key];
        }

        return acc;
      }, {});
  };

  private calculateShadingId(gameObject: GameObject): string {
    const renderable = gameObject.getComponent(Renderable);

    return `${renderable.fit}`;
  }
}

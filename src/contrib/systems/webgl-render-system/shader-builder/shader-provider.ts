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

    this.gameObjectObserver.subscribe('onadd', this.handleGameObjectAdd);
    this.gameObjectObserver.subscribe('onremove', this.handleGameObjectRemove);
  }

  getShadingId(gameObjectId: string): string {
    return this.shadingIdMap[gameObjectId];
  }

  private handleGameObjectAdd = (gameObject: GameObject): void => {
    this.shadingIdMap[gameObject.getId()] = this.calculateShadingId(gameObject);
  };

  private handleGameObjectRemove = (gameObject: GameObject): void => {
    this.shadingIdMap = Object.keys(this.shadingIdMap)
      .reduce((acc: Record<string, string>, key) => {
        if (key !== gameObject.getId()) {
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

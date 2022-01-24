import type {
  GameObjectObserver,
  GameObject,
} from '../../../../engine/gameObject';
import type { Renderable } from '../../../components/renderable';
import { RENDERABLE_COMPONENT_NAME } from '../consts';

export class ShaderProvider {
  private gameObjectObserver: GameObjectObserver;
  private shadingIdMap: Record<string, string>;

  constructor(gameObjectObserver: GameObjectObserver) {
    this.gameObjectObserver = gameObjectObserver;

    this.shadingIdMap = {};

    this.gameObjectObserver.subscribe('onadd', this.handleGameObjectAdd);
    this.gameObjectObserver.subscribe('onremove', this.handleGameObjectRemove);
  }

  getShadingId(gameObject: GameObject): string {
    return this.shadingIdMap[gameObject.getId()];
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
    const renderable = gameObject.getComponent(RENDERABLE_COMPONENT_NAME) as Renderable;

    return `${renderable.fit}`;
  }
}

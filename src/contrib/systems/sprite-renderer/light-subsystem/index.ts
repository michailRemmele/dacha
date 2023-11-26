import type { Scene, Light as ThreeJSLight } from 'three/src/Three';

import { Light } from '../../../components/light';
import { Transform } from '../../../components/transform';
import { filterByKey } from '../../../../engine/utils';
import type { GameObject, GameObjectObserver } from '../../../../engine/game-object';

import { createLight, updateLight } from './light-factory';

export class LightSubsystem {
  private renderScene: Scene;
  private lightsObserver: GameObjectObserver;
  private lightsMap: Record<string, number>;

  constructor(renderScene: Scene, lightsObserver: GameObjectObserver) {
    this.renderScene = renderScene;
    this.lightsObserver = lightsObserver;

    this.lightsMap = {};
  }

  mount(): void {
    this.lightsObserver.subscribe('onadd', this.handleLightAdd);
    this.lightsObserver.subscribe('onremove', this.handleLightRemove);
  }

  unmount(): void {
    this.lightsObserver.unsubscribe('onadd', this.handleLightAdd);
    this.lightsObserver.unsubscribe('onremove', this.handleLightRemove);
  }

  private handleLightAdd = (gameObject: GameObject): void => {
    const { type } = gameObject.getComponent(Light);

    const light = createLight(type);

    light.userData.gameObject = gameObject;
    this.lightsMap[gameObject.getId()] = light.id;

    this.renderScene.add(light);
  };

  private handleLightRemove = (gameObject: GameObject): void => {
    const gameObjectId = gameObject.getId();
    const object = this.renderScene.getObjectById(this.lightsMap[gameObjectId]);

    if (object) {
      this.renderScene.remove(object);
    }

    this.lightsMap = filterByKey(this.lightsMap, gameObjectId);
  };

  update(): void {
    this.lightsObserver.getList().forEach((gameObject) => {
      const transform = gameObject.getComponent(Transform);
      const { type, options } = gameObject.getComponent(Light);

      const light = this.renderScene.getObjectById(
        this.lightsMap[gameObject.getId()],
      ) as ThreeJSLight;

      if (!light) {
        return;
      }

      light.position.setX(transform.offsetX);
      light.position.setY(transform.offsetY);

      updateLight(type, light, options);
    });
  }
}

import type { Scene, Light as ThreeJSLight } from 'three';

import type { GameObject, GameObjectObserver } from '../../../../engine/gameObject';
import type { Light } from '../../../components/light';
import type { Transform } from '../../../components/transform';
import { filterByKey } from '../../../../engine/utils';
import {
  LIGHT_COMPONENT_NAME,
  TRANSFORM_COMPONENT_NAME,
} from '../consts';

import { createLight, updateLight } from './light-factory';

export class LightSubprocessor {
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
    const { type } = gameObject.getComponent(LIGHT_COMPONENT_NAME) as Light;

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
    this.lightsObserver.fireEvents();

    this.lightsObserver.getList().forEach((gameObject) => {
      const transform = gameObject.getComponent(TRANSFORM_COMPONENT_NAME) as Transform;
      const { type, options } = gameObject.getComponent(LIGHT_COMPONENT_NAME) as Light;

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

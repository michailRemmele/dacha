import type { Scene, Light as ThreeJSLight } from 'three/src/Three';

import { Light } from '../../../components/light';
import { Transform } from '../../../components/transform';
import { filterByKey } from '../../../../engine/utils';
import { GameObject } from '../../../../engine/game-object';
import type { GameObjectObserver } from '../../../../engine/game-object';
import { AddGameObject, RemoveGameObject } from '../../../../engine/events';
import type { UpdateGameObjectEvent } from '../../../../engine/events';

import { createLight, updateLight } from './light-factory';

export class LightSubsystem {
  private renderScene: Scene;
  private lightsObserver: GameObjectObserver;
  private lightsMap: Record<string, number>;

  constructor(renderScene: Scene, lightsObserver: GameObjectObserver) {
    this.renderScene = renderScene;
    this.lightsObserver = lightsObserver;

    this.lightsMap = {};

    this.lightsObserver.forEach(this.handleLightAdd);
  }

  mount(): void {
    this.lightsObserver.addEventListener(AddGameObject, this.handleLightAdd);
    this.lightsObserver.addEventListener(RemoveGameObject, this.handleLightRemove);
  }

  unmount(): void {
    this.lightsObserver.removeEventListener(AddGameObject, this.handleLightAdd);
    this.lightsObserver.removeEventListener(RemoveGameObject, this.handleLightRemove);
  }

  private handleLightAdd = (value: UpdateGameObjectEvent | GameObject): void => {
    const gameObject = value instanceof GameObject ? value : value.gameObject;
    const { type } = gameObject.getComponent(Light);

    const light = createLight(type);

    light.userData.gameObject = gameObject;
    this.lightsMap[gameObject.getId()] = light.id;

    this.renderScene.add(light);
  };

  private handleLightRemove = (event: UpdateGameObjectEvent): void => {
    const { gameObject } = event;
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

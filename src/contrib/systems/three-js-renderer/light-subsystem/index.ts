import type { Scene, Light as ThreeJSLight } from 'three';

import type { Entity, EntityObserver } from '../../../../engine/entity';
import type { Light } from '../../../components/light';
import type { Transform } from '../../../components/transform';
import { filterByKey } from '../../../../engine/utils';
import {
  LIGHT_COMPONENT_NAME,
  TRANSFORM_COMPONENT_NAME,
} from '../consts';

import { createLight, updateLight } from './light-factory';

export class LightSubsystem {
  private renderScene: Scene;
  private lightsObserver: EntityObserver;
  private lightsMap: Record<string, number>;

  constructor(renderScene: Scene, lightsObserver: EntityObserver) {
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

  private handleLightAdd = (entity: Entity): void => {
    const { type } = entity.getComponent(LIGHT_COMPONENT_NAME) as Light;

    const light = createLight(type);

    light.userData.entity = entity;
    this.lightsMap[entity.getId()] = light.id;

    this.renderScene.add(light);
  };

  private handleLightRemove = (entity: Entity): void => {
    const entityId = entity.getId();
    const object = this.renderScene.getObjectById(this.lightsMap[entityId]);

    if (object) {
      this.renderScene.remove(object);
    }

    this.lightsMap = filterByKey(this.lightsMap, entityId);
  };

  update(): void {
    this.lightsObserver.fireEvents();

    this.lightsObserver.getList().forEach((entity) => {
      const transform = entity.getComponent(TRANSFORM_COMPONENT_NAME) as Transform;
      const { type, options } = entity.getComponent(LIGHT_COMPONENT_NAME) as Light;

      const light = this.renderScene.getObjectById(
        this.lightsMap[entity.getId()],
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

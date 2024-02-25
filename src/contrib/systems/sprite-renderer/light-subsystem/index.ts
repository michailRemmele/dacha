import type { Scene, Light as ThreeJSLight } from 'three/src/Three';

import { Light } from '../../../components/light';
import { Transform } from '../../../components/transform';
import { filterByKey } from '../../../../engine/utils';
import { Actor } from '../../../../engine/actor';
import type { ActorCollection } from '../../../../engine/actor';
import { AddActor, RemoveActor } from '../../../../engine/events';
import type { AddActorEvent, RemoveActorEvent } from '../../../../engine/events';

import { createLight, updateLight } from './light-factory';

export class LightSubsystem {
  private renderScene: Scene;
  private lightsObserver: ActorCollection;
  private lightsMap: Record<string, number>;

  constructor(renderScene: Scene, lightsObserver: ActorCollection) {
    this.renderScene = renderScene;
    this.lightsObserver = lightsObserver;

    this.lightsMap = {};

    this.lightsObserver.forEach(this.handleLightAdd);
  }

  mount(): void {
    this.lightsObserver.addEventListener(AddActor, this.handleLightAdd);
    this.lightsObserver.addEventListener(RemoveActor, this.handleLightRemove);
  }

  unmount(): void {
    this.lightsObserver.removeEventListener(AddActor, this.handleLightAdd);
    this.lightsObserver.removeEventListener(RemoveActor, this.handleLightRemove);
  }

  private handleLightAdd = (value: AddActorEvent | Actor): void => {
    const actor = value instanceof Actor ? value : value.actor;
    const { type } = actor.getComponent(Light);

    const light = createLight(type);

    light.userData.actor = actor;
    this.lightsMap[actor.id] = light.id;

    this.renderScene.add(light);
  };

  private handleLightRemove = (event: RemoveActorEvent): void => {
    const { actor } = event;
    const object = this.renderScene.getObjectById(this.lightsMap[actor.id]);

    if (object) {
      this.renderScene.remove(object);
    }

    this.lightsMap = filterByKey(this.lightsMap, actor.id);
  };

  update(): void {
    this.lightsObserver.forEach((actor) => {
      const transform = actor.getComponent(Transform);
      const { type, options } = actor.getComponent(Light);

      const light = this.renderScene.getObjectById(
        this.lightsMap[actor.id],
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

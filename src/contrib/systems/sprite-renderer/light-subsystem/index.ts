import type { Scene, Light as ThreeJSLight } from 'three/src/Three';

import { Light } from '../../../components/light';
import { Transform } from '../../../components/transform';
import { Actor } from '../../../../engine/actor';
import type { ActorCollection } from '../../../../engine/actor';
import { RemoveActor } from '../../../../engine/events';
import type { RemoveActorEvent } from '../../../../engine/events';

import { createLight, updateLight } from './light-factory';

export class LightSubsystem {
  private renderScene: Scene;
  private lightsCollection: ActorCollection;
  private lightsMap: Record<string, number>;

  constructor(renderScene: Scene, lightsCollection: ActorCollection) {
    this.renderScene = renderScene;
    this.lightsCollection = lightsCollection;

    this.lightsMap = {};
  }

  mount(): void {
    this.lightsCollection.addEventListener(RemoveActor, this.handleLightRemove);
  }

  unmount(): void {
    this.lightsCollection.removeEventListener(RemoveActor, this.handleLightRemove);
  }

  private handleLightRemove = (event: RemoveActorEvent): void => {
    const { actor } = event;
    const object = this.renderScene.getObjectById(this.lightsMap[actor.id]);

    if (object) {
      this.renderScene.remove(object);
    }

    delete this.lightsMap[actor.id];
  };

  private setUpActor(actor: Actor): void {
    const { type } = actor.getComponent(Light);

    const light = createLight(type);

    light.userData.actor = actor;
    this.lightsMap[actor.id] = light.id;

    this.renderScene.add(light);
  }

  update(): void {
    this.lightsCollection.forEach((actor) => {
      const transform = actor.getComponent(Transform);
      const { type, options } = actor.getComponent(Light);

      if (!this.lightsMap[actor.id]) {
        this.setUpActor(actor);
      }

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

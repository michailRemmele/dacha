import type {
  Scene as ThreeJSScene,
  Light as ThreeJSLight,
} from 'three/src/Three';

import { Light } from '../../../components/light';
import { Transform } from '../../../components/transform';
import { Actor, ActorCollection } from '../../../../engine/actor';
import type { Scene } from '../../../../engine/scene';
import { RemoveActor } from '../../../../engine/events';
import type { RemoveActorEvent } from '../../../../engine/events';

import { createLight, updateLight } from './light-factory';

export class LightSubsystem {
  private renderScene: ThreeJSScene;
  private actorCollection?: ActorCollection;
  private lightsMap: Map<string, number>;

  constructor(renderScene: ThreeJSScene) {
    this.renderScene = renderScene;

    this.lightsMap = new Map();
  }

  onSceneEnter(scene: Scene): void {
    this.actorCollection = new ActorCollection(scene, {
      components: [
        Light,
        Transform,
      ],
    });

    this.actorCollection.addEventListener(RemoveActor, this.handleActorRemove);
  }

  onSceneExit(): void {
    this.actorCollection?.removeEventListener(RemoveActor, this.handleActorRemove);

    this.actorCollection = undefined;

    this.lightsMap.clear();
  }

  private handleActorRemove = (event: RemoveActorEvent): void => {
    const { actor } = event;

    const objectId = this.lightsMap.get(actor.id);
    if (objectId) {
      const object = this.renderScene.getObjectById(objectId);
      if (object) {
        this.renderScene.remove(object);
      }
    }

    this.lightsMap.delete(actor.id);
  };

  private setUpActor(actor: Actor): void {
    const { type } = actor.getComponent(Light);

    const light = createLight(type);

    light.userData.actor = actor;
    this.lightsMap.set(actor.id, light.id);

    this.renderScene.add(light);
  }

  update(): void {
    this.actorCollection?.forEach((actor) => {
      const transform = actor.getComponent(Transform);
      const { type, options } = actor.getComponent(Light);

      if (!this.lightsMap.has(actor.id)) {
        this.setUpActor(actor);
      }

      const light = this.renderScene.getObjectById(
        this.lightsMap.get(actor.id)!,
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

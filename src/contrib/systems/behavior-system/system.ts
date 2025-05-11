import { SceneSystem } from '../../../engine/system';
import type {
  SceneSystemOptions,
  UpdateOptions,
} from '../../../engine/system';
import { Actor, ActorCollection } from '../../../engine/actor';
import type { ActorSpawner } from '../../../engine/actor';
import type { World } from '../../../engine/world';
import type { Scene } from '../../../engine/scene';
import { Behaviors } from '../../components';
import { RemoveActor } from '../../../engine/events';
import type { RemoveActorEvent } from '../../../engine/events';

import type { Behavior, BehaviorOptions, BehaviorConstructor } from './types';

export class BehaviorSystem extends SceneSystem {
  private behaviorCollection: ActorCollection;
  private actorSpawner: ActorSpawner;
  private globalOptions: Record<string, unknown>;
  private behaviors: Record<string, BehaviorConstructor>;
  private world: World;
  private scene: Scene;
  private activeBehaviors: Record<string, Behavior[]>;

  constructor(options: SceneSystemOptions) {
    super();

    const {
      actorSpawner,
      world,
      scene,
      globalOptions,
      resources = {},
    } = options;

    this.world = world;
    this.scene = scene;
    this.behaviorCollection = new ActorCollection(scene, {
      components: [Behaviors],
    });
    this.actorSpawner = actorSpawner;
    this.globalOptions = globalOptions;
    this.behaviors = (resources as BehaviorConstructor[]).reduce((acc, behavior) => {
      if (behavior.behaviorName === undefined) {
        throw new Error(`Missing behaviorName field for ${behavior.name} behavior.`);
      }

      acc[behavior.behaviorName] = behavior;
      return acc;
    }, {} as Record<string, BehaviorConstructor>);

    this.activeBehaviors = {};

    this.behaviorCollection.addEventListener(RemoveActor, this.handleActorRemove);
  }

  onSceneDestroy(): void {
    this.behaviorCollection.removeEventListener(RemoveActor, this.handleActorRemove);

    this.behaviorCollection.forEach((actor) => {
      this.activeBehaviors[actor.id].forEach((behavior) => behavior.destroy?.());
      delete this.activeBehaviors[actor.id];
    });
  }

  private handleActorRemove = (event: RemoveActorEvent): void => {
    const { actor } = event;
    this.activeBehaviors[actor.id].forEach((behavior) => behavior.destroy?.());
    delete this.activeBehaviors[actor.id];
  };

  private setUpBehavior(actor: Actor): void {
    const { list } = actor.getComponent(Behaviors);
    this.activeBehaviors[actor.id] = list.map((config) => {
      const options: BehaviorOptions = {
        ...config.options,
        actor,
        actorSpawner: this.actorSpawner,
        world: this.world,
        scene: this.scene,
        globalOptions: this.globalOptions,
      };
      const BehaviorClass = this.behaviors[config.name];
      return new BehaviorClass(options);
    });
  }

  update(options: UpdateOptions): void {
    this.behaviorCollection.forEach((actor) => {
      if (!this.activeBehaviors[actor.id]) {
        this.setUpBehavior(actor);
      }

      this.activeBehaviors[actor.id].forEach((behavior) => behavior.update?.(options));
    });
  }
}

BehaviorSystem.systemName = 'BehaviorSystem';

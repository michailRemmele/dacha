import { SceneSystem } from '../../../engine/system';
import type { SceneSystemOptions, UpdateOptions } from '../../../engine/system';
import { Actor, ActorQuery } from '../../../engine/actor';
import type { ActorSpawner } from '../../../engine/actor';
import type { World } from '../../../engine/world';
import type { Scene } from '../../../engine/scene';
import { Behaviors } from '../../components';
import { AddActor, RemoveActor } from '../../../engine/events';
import type { AddActorEvent, RemoveActorEvent } from '../../../engine/events';

import type { Behavior, BehaviorOptions, BehaviorConstructor } from './types';

/**
 * Behavior system that manages custom behavior execution for actors
 * with {@link Behaviors} components
 *
 * @extends SceneSystem
 * 
 * @category Systems
 */
export class BehaviorSystem extends SceneSystem {
  private behaviorQuery: ActorQuery;
  private actorSpawner: ActorSpawner;
  private globalOptions: Record<string, unknown>;
  private behaviors: Record<string, BehaviorConstructor | undefined>;
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
    this.behaviorQuery = new ActorQuery({
      scene,
      filter: [Behaviors],
    });
    this.actorSpawner = actorSpawner;
    this.globalOptions = globalOptions;
    this.behaviors = (resources as BehaviorConstructor[]).reduce(
      (acc, behavior) => {
        if (behavior.behaviorName === undefined) {
          throw new Error(
            `Missing behaviorName field for ${behavior.name} behavior.`,
          );
        }

        acc[behavior.behaviorName] = behavior;
        return acc;
      },
      {} as Record<string, BehaviorConstructor>,
    );

    this.activeBehaviors = {};
  }

  onSceneEnter(): void {
    this.behaviorQuery
      .getActors()
      .forEach((actor) => this.setUpBehavior(actor));

    this.behaviorQuery.addEventListener(AddActor, this.handleActorAdd);
    this.behaviorQuery.addEventListener(RemoveActor, this.handleActorRemove);
  }

  onSceneDestroy(): void {
    this.behaviorQuery.removeEventListener(AddActor, this.handleActorAdd);
    this.behaviorQuery.removeEventListener(RemoveActor, this.handleActorRemove);

    this.behaviorQuery.getActors().forEach((actor) => {
      this.activeBehaviors[actor.id].forEach((behavior) =>
        behavior.destroy?.(),
      );
      delete this.activeBehaviors[actor.id];
    });
  }

  private handleActorAdd = (event: AddActorEvent): void => {
    const { actor } = event;
    this.setUpBehavior(actor);
  };

  private handleActorRemove = (event: RemoveActorEvent): void => {
    const { actor } = event;
    this.activeBehaviors[actor.id].forEach((behavior) => behavior.destroy?.());
    delete this.activeBehaviors[actor.id];
  };

  private setUpBehavior(actor: Actor): void {
    const { list } = actor.getComponent(Behaviors);
    this.activeBehaviors[actor.id] = list
      .filter((config) => {
        if (!this.behaviors[config.name]) {
          console.warn(`Behavior not found: ${config.name}`);
        }
        return this.behaviors[config.name];
      })
      .map((config) => {
        const options: BehaviorOptions = {
          ...config.options,
          actor,
          actorSpawner: this.actorSpawner,
          world: this.world,
          scene: this.scene,
          globalOptions: this.globalOptions,
        };
        const BehaviorClass = this.behaviors[config.name]!;
        return new BehaviorClass(options);
      });
  }

  update(options: UpdateOptions): void {
    this.behaviorQuery.getActors().forEach((actor) => {
      this.activeBehaviors[actor.id].forEach((behavior) =>
        behavior.update?.(options),
      );
    });
  }
}

BehaviorSystem.systemName = 'BehaviorSystem';

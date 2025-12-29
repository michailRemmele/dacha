import { Vector2 } from '../../../../../engine/math-lib';
import type {
  SceneSystemOptions,
  UpdateOptions,
} from '../../../../../engine/system';
import { Actor, ActorQuery } from '../../../../../engine/actor';
import type { Scene } from '../../../../../engine/scene';
import { RigidBody } from '../../../../components/rigid-body';
import { Transform } from '../../../../components/transform';
import type { PhysicsSystemOptions } from '../../types';
import { AddForce, AddImpulse, StopMovement } from '../../../../events';
import type { AddForceEvent, AddImpulseEvent } from '../../../../events';
import { RemoveActor } from '../../../../../engine/events';
import type { RemoveActorEvent } from '../../../../../engine/events';
import type { ActorEvent } from '../../../../../types/events';

interface ActorVectors {
  velocity: Vector2;
  force: Vector2;
  impulse: Vector2;
}

const DIRECTION_VECTOR = {
  UP: new Vector2(0, -1),
  LEFT: new Vector2(-1, 0),
  RIGHT: new Vector2(1, 0),
  DOWN: new Vector2(0, 1),
};

export class PhysicsSubsystem {
  private scene: Scene;
  private actorQuery: ActorQuery;
  private gravity: number;
  private actorVectors: Record<string, ActorVectors | undefined>;

  constructor(options: SceneSystemOptions) {
    const { gravity, scene } = options as PhysicsSystemOptions;

    this.scene = scene;
    this.actorQuery = new ActorQuery({ scene, filter: [RigidBody, Transform] });
    this.gravity = gravity;

    this.actorVectors = {};

    this.actorQuery.addEventListener(RemoveActor, this.handleActorRemove);

    this.scene.addEventListener(StopMovement, this.handleStopMovement);
    this.scene.addEventListener(AddForce, this.handleAddForce);
    this.scene.addEventListener(AddImpulse, this.handleAddImpulse);
  }

  destroy(): void {
    this.actorQuery.removeEventListener(RemoveActor, this.handleActorRemove);

    this.scene.removeEventListener(StopMovement, this.handleStopMovement);
    this.scene.removeEventListener(AddForce, this.handleAddForce);
    this.scene.removeEventListener(AddImpulse, this.handleAddImpulse);
  }

  private handleActorRemove = (event: RemoveActorEvent): void => {
    const { actor } = event;

    delete this.actorVectors[actor.id];
  };

  private handleStopMovement = (event: ActorEvent): void => {
    const { target } = event;

    if (!this.actorVectors[target.id]) {
      this.setUpVectors(target);
    }

    this.actorVectors[target.id]!.velocity.multiplyNumber(0);
  };

  private handleAddForce = (event: AddForceEvent): void => {
    const { target, value } = event;

    if (!this.actorVectors[target.id]) {
      this.setUpVectors(target);
    }

    this.actorVectors[target.id]!.force.add(value);
  };

  private handleAddImpulse = (event: AddImpulseEvent): void => {
    const { target, value } = event;

    if (!this.actorVectors[target.id]) {
      this.setUpVectors(target);
    }

    this.actorVectors[target.id]!.impulse.add(value);
  };

  private setUpVectors(actor: Actor): void {
    this.actorVectors[actor.id] = {
      velocity: new Vector2(0, 0),
      force: new Vector2(0, 0),
      impulse: new Vector2(0, 0),
    };
  }

  private applyDragForce(actor: Actor, deltaTime: number): void {
    const { mass, drag } = actor.getComponent(RigidBody);
    const velocity = this.actorVectors[actor.id]?.velocity;

    if (!drag || !velocity || (!velocity.x && !velocity.y)) {
      return;
    }

    const velocitySignX = Math.sign(velocity.x);
    const velocitySignY = Math.sign(velocity.y);

    const reactionForceValue = mass * this.gravity;
    const dragForceValue = -1 * drag * reactionForceValue;
    const forceToVelocityMultiplier = deltaTime / mass;
    const slowdownValue = dragForceValue * forceToVelocityMultiplier;
    const normalizationMultiplier = 1 / velocity.magnitude;

    const slowdown = velocity.clone();
    slowdown.multiplyNumber(slowdownValue * normalizationMultiplier);

    velocity.add(slowdown);

    if (
      Math.sign(velocity.x) !== velocitySignX &&
      Math.sign(velocity.y) !== velocitySignY
    ) {
      velocity.multiplyNumber(0);
    }
  }

  private getGravityForce(rigidBody: RigidBody): Vector2 {
    const { mass, useGravity } = rigidBody;

    const gravityVector = new Vector2(0, 0);

    if (useGravity) {
      gravityVector.add(DIRECTION_VECTOR.DOWN);
      gravityVector.multiplyNumber(mass * this.gravity);
    }

    return gravityVector;
  }

  update(options: UpdateOptions): void {
    const { deltaTime } = options;
    const deltaTimeInMsec = deltaTime;
    const deltaTimeInSeconds = deltaTimeInMsec / 1000;

    this.actorQuery.getActors().forEach((actor) => {
      const rigidBody = actor.getComponent(RigidBody);
      const transform = actor.getComponent(Transform);
      const { mass } = rigidBody;

      if (!this.actorVectors[actor.id]) {
        this.setUpVectors(actor);
      }

      const { velocity, force, impulse } = this.actorVectors[actor.id]!;

      force.add(this.getGravityForce(rigidBody));

      if (force.x || force.y) {
        force.multiplyNumber(deltaTimeInSeconds / mass);
        velocity.add(force);
      }

      if (impulse.x || impulse.y) {
        impulse.multiplyNumber(1 / mass);
        velocity.add(impulse);
      }

      this.applyDragForce(actor, deltaTimeInSeconds);

      transform.world.position.x += velocity.x * deltaTimeInSeconds;
      transform.world.position.y += velocity.y * deltaTimeInSeconds;

      force.multiplyNumber(0);
      impulse.multiplyNumber(0);
    });
  }
}

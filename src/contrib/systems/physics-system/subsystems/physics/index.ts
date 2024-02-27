import { Vector2 } from '../../../../../engine/mathLib';
import type { SystemOptions, UpdateOptions } from '../../../../../engine/system';
import { Actor, ActorCollection } from '../../../../../engine/actor';
import type { Scene } from '../../../../../engine/scene';
import { RigidBody } from '../../../../components/rigid-body';
import { Transform } from '../../../../components/transform';
import type { PhysicsSystemOptions } from '../../types';
import {
  AddForce,
  AddImpulse,
  StopMovement,
} from '../../../../events';
import type { AddForceEvent, AddImpulseEvent } from '../../../../events';
import { AddActor, RemoveActor } from '../../../../../engine/events';
import type { AddActorEvent, RemoveActorEvent } from '../../../../../engine/events';
import type { ActorEvent } from '../../../../../types/events';

const DIRECTION_VECTOR = {
  UP: new Vector2(0, -1),
  LEFT: new Vector2(-1, 0),
  RIGHT: new Vector2(1, 0),
  DOWN: new Vector2(0, 1),
};

export class PhysicsSubsystem {
  private scene: Scene;
  private actorCollection: ActorCollection;
  private gravitationalAcceleration: number;
  private actorsVelocity: Record<string, Vector2 | undefined>;
  private actorsForceVector: Record<string, Vector2 | undefined>;
  private actorsImpulseVector: Record<string, Vector2 | undefined>;

  constructor(options: SystemOptions) {
    const {
      gravitationalAcceleration, scene,
    } = options as PhysicsSystemOptions;

    this.scene = scene;
    this.actorCollection = new ActorCollection(scene, {
      components: [
        RigidBody,
        Transform,
      ],
    });
    this.gravitationalAcceleration = gravitationalAcceleration;

    this.actorsVelocity = {};
    this.actorsForceVector = {};
    this.actorsImpulseVector = {};

    this.actorCollection.forEach(this.handleActorAdd);
  }

  mount(): void {
    this.actorCollection.addEventListener(AddActor, this.handleActorAdd);
    this.actorCollection.addEventListener(RemoveActor, this.handleActorRemove);

    this.scene.addEventListener(StopMovement, this.handleStopMovement);
    this.scene.addEventListener(AddForce, this.handleAddForce);
    this.scene.addEventListener(AddImpulse, this.handleAddImpulse);
  }

  unmount(): void {
    this.actorCollection.removeEventListener(AddActor, this.handleActorAdd);
    this.actorCollection.removeEventListener(RemoveActor, this.handleActorRemove);

    this.scene.removeEventListener(StopMovement, this.handleStopMovement);
    this.scene.removeEventListener(AddForce, this.handleAddForce);
    this.scene.removeEventListener(AddImpulse, this.handleAddImpulse);
  }

  private handleActorAdd = (value: AddActorEvent | Actor): void => {
    const actor = value instanceof Actor ? value : value.actor;

    this.actorsVelocity[actor.id] = new Vector2(0, 0);
    this.actorsForceVector[actor.id] = new Vector2(0, 0);
    this.actorsImpulseVector[actor.id] = new Vector2(0, 0);
  };

  private handleActorRemove = (event: RemoveActorEvent): void => {
    const { actor } = event;

    delete this.actorsVelocity[actor.id];
    delete this.actorsForceVector[actor.id];
    delete this.actorsImpulseVector[actor.id];
  };

  private handleStopMovement = (event: ActorEvent): void => {
    this.actorsVelocity[event.target.id]?.multiplyNumber(0);
  };

  private handleAddForce = (event: AddForceEvent): void => {
    const { target, value } = event;
    this.actorsForceVector[target.id]?.add(value);
  };

  private handleAddImpulse = (event: AddImpulseEvent): void => {
    const { target, value } = event;
    this.actorsImpulseVector[target.id]?.add(value);
  };

  private applyDragForce(actor: Actor, deltaTime: number): void {
    const { mass, drag } = actor.getComponent(RigidBody);
    const velocity = this.actorsVelocity[actor.id];

    if (!drag || !velocity || (!velocity.x && !velocity.y)) {
      return;
    }

    const velocitySignX = Math.sign(velocity.x);
    const velocitySignY = Math.sign(velocity.y);

    const reactionForceValue = mass * this.gravitationalAcceleration;
    const dragForceValue = -1 * drag * reactionForceValue;
    const forceToVelocityMultiplier = deltaTime / mass;
    const slowdownValue = dragForceValue * forceToVelocityMultiplier;
    const normalizationMultiplier = 1 / velocity.magnitude;

    const slowdown = velocity.clone();
    slowdown.multiplyNumber(slowdownValue * normalizationMultiplier);

    velocity.add(slowdown);

    if (Math.sign(velocity.x) !== velocitySignX && Math.sign(velocity.y) !== velocitySignY) {
      velocity.multiplyNumber(0);
    }
  }

  private getGravityForce(rigidBody: RigidBody): Vector2 {
    const { mass, useGravity } = rigidBody;

    const gravityVector = new Vector2(0, 0);

    if (useGravity) {
      gravityVector.add(DIRECTION_VECTOR.DOWN);
      gravityVector.multiplyNumber(mass * this.gravitationalAcceleration);
    }

    return gravityVector;
  }

  update(options: UpdateOptions): void {
    const { deltaTime } = options;
    const deltaTimeInMsec = deltaTime;
    const deltaTimeInSeconds = deltaTimeInMsec / 1000;

    this.actorCollection.forEach((actor) => {
      const rigidBody = actor.getComponent(RigidBody);
      const transform = actor.getComponent(Transform);
      const { mass } = rigidBody;

      const forceVector = this.actorsForceVector[actor.id]!;
      const impulseVector = this.actorsImpulseVector[actor.id]!;
      const velocityVector = this.actorsVelocity[actor.id]!;

      forceVector.add(this.getGravityForce(rigidBody));

      if (forceVector.x || forceVector.y) {
        forceVector.multiplyNumber(deltaTimeInSeconds / mass);
        velocityVector.add(forceVector);
      }

      if (impulseVector.x || impulseVector.y) {
        impulseVector.multiplyNumber(1 / mass);
        velocityVector.add(impulseVector);
      }

      this.applyDragForce(actor, deltaTimeInSeconds);

      transform.offsetX += velocityVector.x * deltaTimeInSeconds;
      transform.offsetY += velocityVector.y * deltaTimeInSeconds;

      forceVector.multiplyNumber(0);
      impulseVector.multiplyNumber(0);
    });
  }
}

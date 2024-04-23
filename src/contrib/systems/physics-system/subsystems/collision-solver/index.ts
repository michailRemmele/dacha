import { Vector2 } from '../../../../../engine/mathLib';
import type { SystemOptions } from '../../../../../engine/system';
import type { Actor } from '../../../../../engine/actor';
import type { Scene } from '../../../../../engine/scene';
import { RigidBody } from '../../../../components/rigid-body';
import type { PhysicsSystemOptions } from '../../types';
import {
  Collision,
  AddForce,
  StopMovement,
  CollisionLeave,
} from '../../../../events';
import type { CollisionEvent, CollisionLeaveEvent } from '../../../../events';
import { RIGID_BODY_TYPE } from '../../consts';

const REACTION_FORCE_VECTOR_X = 0;
const REACTION_FORCE_VECTOR_Y = -1;

export class CollisionSolver {
  private scene: Scene;
  private gravitationalAcceleration: number;

  private passingThroughPlatform: Array<[string, string]>;

  constructor(options: SystemOptions) {
    const { scene, gravitationalAcceleration } = options as PhysicsSystemOptions;

    this.scene = scene;
    this.gravitationalAcceleration = gravitationalAcceleration;

    this.passingThroughPlatform = [];
  }

  mount(): void {
    this.scene.addEventListener(Collision, this.handleCollision);

    this.scene.addEventListener(CollisionLeave, this.handleCollisionLeave);
  }

  unmount(): void {
    this.scene.removeEventListener(Collision, this.handleCollision);

    this.scene.removeEventListener(CollisionLeave, this.handleCollisionLeave);
  }

  private handleCollisionLeave = (event: CollisionLeaveEvent): void => {
    const rigidBody = event.actor.getComponent(RigidBody);
    if (rigidBody && rigidBody.isPlatform) {
      this.passingThroughPlatform = this.passingThroughPlatform.filter(
        (pair) => pair[0] !== event.target.id || pair[1] !== event.actor.id,
      );
    }
  };

  private handleCollision = (event: CollisionEvent): void => {
    const { actor1, actor2, mtv1 } = event;

    if (!this.validateCollision(actor1, actor2)) {
      return;
    }

    this.addReactionForce(actor1, mtv1);
  };

  private isPassingThroughPlatform(actor1: Actor, actor2: Actor): boolean {
    return this.passingThroughPlatform.some(
      (pair) => pair[0] === actor1.id && pair[1] === actor2.id,
    );
  }

  private validateCollision(actor1: Actor, actor2: Actor): boolean {
    const rigidBody1 = actor1.getComponent(RigidBody) as RigidBody | undefined;
    const rigidBody2 = actor2.getComponent(RigidBody) as RigidBody | undefined;

    if (!rigidBody1 || !rigidBody2) {
      return false;
    }

    if (rigidBody2.type === RIGID_BODY_TYPE.STATIC
      && rigidBody2.isPlatform
      && this.isPassingThroughPlatform(actor1, actor2)) {
      return false;
    }

    if (rigidBody2.type === RIGID_BODY_TYPE.STATIC
      && rigidBody2.isPlatform
      && rigidBody1.velocity?.y && rigidBody1.velocity?.y < 0) {
      this.passingThroughPlatform.push([actor1.id, actor2.id]);
      return false;
    }

    if (rigidBody2.type === RIGID_BODY_TYPE.STATIC) {
      return !rigidBody1.ghost && !rigidBody2.ghost;
    }

    return !rigidBody1.ghost && !rigidBody1.isPermeable
      && !rigidBody2.ghost && !rigidBody2.isPermeable;
  }

  private addReactionForce(actor: Actor, mtv: Vector2): void {
    const rigidBody = actor.getComponent(RigidBody);
    const { useGravity, mass } = rigidBody;

    if (useGravity && mtv.y && Math.sign(mtv.y) === -1 && !mtv.x) {
      const reactionForce = new Vector2(REACTION_FORCE_VECTOR_X, REACTION_FORCE_VECTOR_Y);
      reactionForce.multiplyNumber(mass * this.gravitationalAcceleration);

      actor.dispatchEventImmediately(AddForce, {
        value: reactionForce,
      });
      actor.dispatchEventImmediately(StopMovement);
    }
  }
}

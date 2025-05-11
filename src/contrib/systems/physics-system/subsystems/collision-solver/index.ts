import { Vector2 } from '../../../../../engine/math-lib';
import type { SceneSystemOptions } from '../../../../../engine/system';
import type { Actor } from '../../../../../engine/actor';
import type { Scene } from '../../../../../engine/scene';
import { RigidBody } from '../../../../components/rigid-body';
import type { PhysicsSystemOptions } from '../../types';
import { Collision, AddForce, StopMovement } from '../../../../events';
import type { CollisionEvent } from '../../../../events';
import { RIGID_BODY_TYPE } from '../../consts';

const REACTION_FORCE_VECTOR_X = 0;
const REACTION_FORCE_VECTOR_Y = -1;

export class CollisionSolver {
  private scene: Scene;
  private gravitationalAcceleration: number;

  constructor(options: SceneSystemOptions) {
    const { scene, gravitationalAcceleration } = options as PhysicsSystemOptions;

    this.scene = scene;
    this.gravitationalAcceleration = gravitationalAcceleration;

    this.scene.addEventListener(Collision, this.handleCollision);
  }

  destroy(): void {
    this.scene.removeEventListener(Collision, this.handleCollision);
  }

  private handleCollision = (event: CollisionEvent): void => {
    const { actor1, actor2, mtv1 } = event;

    if (!this.validateCollision(actor1, actor2)) {
      return;
    }

    this.addReactionForce(actor1, mtv1);
  };

  private validateCollision(actor1: Actor, actor2: Actor): boolean {
    const rigidBody1 = actor1.getComponent(RigidBody) as RigidBody | undefined;
    const rigidBody2 = actor2.getComponent(RigidBody) as RigidBody | undefined;

    if (!rigidBody1 || !rigidBody2) {
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

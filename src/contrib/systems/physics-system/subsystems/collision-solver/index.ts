import { Vector2 } from '../../../../../engine/math-lib';
import type { SceneSystemOptions } from '../../../../../engine/system';
import type { Actor } from '../../../../../engine/actor';
import { RigidBody } from '../../../../components/rigid-body';
import type { PhysicsSystemOptions } from '../../types';
import { RIGID_BODY_TYPE } from '../../consts';
import type { Contact } from '../collision-detection/types';

const REACTION_FORCE_VECTOR_X = 0;
const REACTION_FORCE_VECTOR_Y = -1;

export class CollisionSolver {
  private gravity: number;

  constructor(options: SceneSystemOptions) {
    const { gravity } = options as PhysicsSystemOptions;

    this.gravity = gravity;
  }

  private validateCollision(actor1: Actor, actor2: Actor): boolean {
    const rigidBody1 = actor1.getComponent(RigidBody) as RigidBody | undefined;
    const rigidBody2 = actor2.getComponent(RigidBody) as RigidBody | undefined;

    if (!rigidBody1 || !rigidBody2) {
      return false;
    }
    return (
      rigidBody1.type !== RIGID_BODY_TYPE.STATIC ||
      rigidBody2.type !== RIGID_BODY_TYPE.STATIC
    );
  }

  private addReactionForce(actor: Actor, mtv: Vector2): void {
    const rigidBody = actor.getComponent(RigidBody);
    const { gravityScale, mass, linearVelocity } = rigidBody;

    if (gravityScale && mtv.y && Math.sign(mtv.y) === -1 && !mtv.x) {
      const reactionForce = new Vector2(
        REACTION_FORCE_VECTOR_X,
        REACTION_FORCE_VECTOR_Y,
      );
      reactionForce.multiplyNumber(mass * this.gravity * gravityScale);

      rigidBody.applyForce(reactionForce);
      linearVelocity.multiplyNumber(0);
    }
  }

  update(contacts: Contact[]): void {
    contacts.forEach((contact) => {
      const {
        actor1, actor2, mtv1, mtv2,
      } = contact;

      if (!this.validateCollision(actor1, actor2)) {
        return;
      }

      this.addReactionForce(actor1, mtv1);
      this.addReactionForce(actor2, mtv2);
    });
  }
}

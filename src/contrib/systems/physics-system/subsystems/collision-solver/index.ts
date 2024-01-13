import { Vector2 } from '../../../../../engine/mathLib';
import type { SystemOptions } from '../../../../../engine/system';
import type { GameObject } from '../../../../../engine/game-object';
import type { Scene } from '../../../../../engine/scene';
import { RigidBody } from '../../../../components/rigid-body';
import type { PhysicsSystemOptions } from '../../types';
import { Collision, AddForce, StopMovement } from '../../../../events';
import type { CollisionEvent } from '../../../../events';

const REACTION_FORCE_VECTOR_X = 0;
const REACTION_FORCE_VECTOR_Y = -1;

export class CollisionSolver {
  private scene: Scene;
  private gravitationalAcceleration: number;

  constructor(options: SystemOptions) {
    const { scene, gravitationalAcceleration } = options as PhysicsSystemOptions;

    this.scene = scene;
    this.gravitationalAcceleration = gravitationalAcceleration;
  }

  mount(): void {
    this.scene.addEventListener(Collision, this.handleCollision);
  }

  unmount(): void {
    this.scene.removeEventListener(Collision, this.handleCollision);
  }

  private handleCollision = (event: CollisionEvent): void => {
    const { gameObject1, gameObject2, mtv1 } = event;

    if (!this.validateCollision(gameObject1, gameObject2)) {
      return;
    }

    this.addReactionForce(gameObject1, mtv1);
  };

  private validateCollision(gameObject1: GameObject, gameObject2: GameObject): boolean {
    const rigidBody1 = gameObject1.getComponent(RigidBody);
    const rigidBody2 = gameObject2.getComponent(RigidBody);

    return rigidBody1 && !rigidBody1.ghost && rigidBody2 && !rigidBody2.ghost;
  }

  private addReactionForce(gameObject: GameObject, mtv: Vector2): void {
    const rigidBody = gameObject.getComponent(RigidBody);
    const { useGravity, mass } = rigidBody;

    if (useGravity && mtv.y && Math.sign(mtv.y) === -1 && !mtv.x) {
      const reactionForce = new Vector2(REACTION_FORCE_VECTOR_X, REACTION_FORCE_VECTOR_Y);
      reactionForce.multiplyNumber(mass * this.gravitationalAcceleration);

      gameObject.emit(AddForce, {
        value: reactionForce,
      });
      gameObject.emit(StopMovement);
    }
  }
}

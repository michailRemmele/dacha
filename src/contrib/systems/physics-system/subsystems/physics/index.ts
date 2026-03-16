import { Vector2 } from '../../../../../engine/math-lib';
import type {
  SceneSystemOptions,
  UpdateOptions,
} from '../../../../../engine/system';
import { ActorQuery } from '../../../../../engine/actor';
import { RigidBody } from '../../../../components/rigid-body';
import { Transform } from '../../../../components/transform';
import type { PhysicsSystemOptions } from '../../types';

const DIRECTION_VECTOR = {
  UP: new Vector2(0, -1),
  LEFT: new Vector2(-1, 0),
  RIGHT: new Vector2(1, 0),
  DOWN: new Vector2(0, 1),
};

export class PhysicsSubsystem {
  private actorQuery: ActorQuery;
  private gravity: number;

  constructor(options: SceneSystemOptions) {
    const { gravity, scene } = options as PhysicsSystemOptions;

    this.actorQuery = new ActorQuery({ scene, filter: [RigidBody, Transform] });
    this.gravity = gravity;
  }

  destroy(): void {
    this.actorQuery.destroy();
  }

  private applyLinearDamping(rigidBody: RigidBody, deltaTime: number): void {
    const { mass, linearDamping, linearVelocity } = rigidBody;

    if (!linearDamping || (!linearVelocity.x && !linearVelocity.y)) {
      return;
    }

    const velocitySignX = Math.sign(linearVelocity.x);
    const velocitySignY = Math.sign(linearVelocity.y);

    const reactionForceValue = mass * this.gravity;
    const dragForceValue = -1 * linearDamping * reactionForceValue;
    const forceToVelocityMultiplier = deltaTime / mass;
    const slowdownValue = dragForceValue * forceToVelocityMultiplier;
    const normalizationMultiplier = 1 / linearVelocity.magnitude;

    const slowdown = linearVelocity.clone();
    slowdown.multiplyNumber(slowdownValue * normalizationMultiplier);

    linearVelocity.add(slowdown);

    if (
      Math.sign(linearVelocity.x) !== velocitySignX &&
      Math.sign(linearVelocity.y) !== velocitySignY
    ) {
      linearVelocity.multiplyNumber(0);
    }
  }

  private getGravityForce(rigidBody: RigidBody): Vector2 {
    const { mass, gravityScale } = rigidBody;

    const gravityVector = new Vector2(0, 0);

    if (gravityScale) {
      gravityVector.add(DIRECTION_VECTOR.DOWN);
      gravityVector.multiplyNumber(mass * this.gravity * gravityScale);
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

      if (rigidBody.disabled || rigidBody.type === 'static' || mass <= 0) {
        rigidBody.clearForces();
        return;
      }

      const { force, impulse } = rigidBody;
      const velocity = rigidBody.linearVelocity;

      if (rigidBody.sleeping) {
        if (force.x || force.y || impulse.x || impulse.y) {
          rigidBody.wakeUp();
        } else {
          return;
        }
      }

      force.add(this.getGravityForce(rigidBody));

      if (force.x || force.y) {
        force.multiplyNumber(deltaTimeInSeconds / mass);
        velocity.add(force);
      }

      if (impulse.x || impulse.y) {
        impulse.multiplyNumber(1 / mass);
        velocity.add(impulse);
      }

      this.applyLinearDamping(rigidBody, deltaTimeInSeconds);

      transform.world.position.x += velocity.x * deltaTimeInSeconds;
      transform.world.position.y += velocity.y * deltaTimeInSeconds;

      rigidBody.clearForces();
    });
  }
}

import type {
  SceneSystemOptions,
  UpdateOptions,
} from '../../../../../engine/system';
import { ActorQuery } from '../../../../../engine/actor';
import { RigidBody } from '../../../../components/rigid-body';
import { Transform } from '../../../../components/transform';
import type { PhysicsSystemOptions } from '../../types';

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
    const slowdownMultiplier = slowdownValue * normalizationMultiplier;

    linearVelocity.x += linearVelocity.x * slowdownMultiplier;
    linearVelocity.y += linearVelocity.y * slowdownMultiplier;

    if (
      Math.sign(linearVelocity.x) !== velocitySignX &&
      Math.sign(linearVelocity.y) !== velocitySignY
    ) {
      linearVelocity.multiplyNumber(0);
    }
  }

  private integrateVelocities(deltaTimeInSeconds: number): void {
    this.actorQuery.getActors().forEach((actor) => {
      const rigidBody = actor.getComponent(RigidBody);
      const { mass, inverseMass } = rigidBody;

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

      if (rigidBody.gravityScale) {
        force.y += mass * this.gravity * rigidBody.gravityScale;
      }

      if (force.x || force.y) {
        force.multiplyNumber(deltaTimeInSeconds * inverseMass);
        velocity.add(force);
      }

      if (impulse.x || impulse.y) {
        impulse.multiplyNumber(inverseMass);
        velocity.add(impulse);
      }

      this.applyLinearDamping(rigidBody, deltaTimeInSeconds);

      rigidBody.clearForces();
    });
  }

  private integratePositions(deltaTimeInSeconds: number): void {
    this.actorQuery.getActors().forEach((actor) => {
      const rigidBody = actor.getComponent(RigidBody);
      const transform = actor.getComponent(Transform);

      if (
        rigidBody.disabled ||
        rigidBody.type === 'static' ||
        rigidBody.mass <= 0 ||
        rigidBody.sleeping
      ) {
        return;
      }

      transform.world.position.x +=
        rigidBody.linearVelocity.x * deltaTimeInSeconds;
      transform.world.position.y +=
        rigidBody.linearVelocity.y * deltaTimeInSeconds;
    });
  }

  update(options: UpdateOptions): void {
    const deltaTimeInSeconds = options.deltaTime / 1000;

    this.integrateVelocities(deltaTimeInSeconds);
    this.integratePositions(deltaTimeInSeconds);
  }
}

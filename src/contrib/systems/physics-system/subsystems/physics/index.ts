import type { UpdateOptions } from '../../../../../engine/system';
import { ActorQuery, type Actor } from '../../../../../engine/actor';
import type { Scene } from '../../../../../engine/scene';
import type { Vector2 } from '../../../../../engine/math-lib';
import { RigidBody } from '../../../../components/rigid-body';
import { Transform } from '../../../../components/transform';

export interface PhysicsSubsystemOptions {
  scene: Scene;
  getGravity: () => Vector2;
}

export class PhysicsSubsystem {
  private actorQuery: ActorQuery;
  private getGravity: () => Vector2;

  private kinematicMovedActors: Set<Actor>;

  constructor(options: PhysicsSubsystemOptions) {
    const { scene, getGravity } = options;

    this.actorQuery = new ActorQuery({ scene, filter: [RigidBody, Transform] });
    this.getGravity = getGravity;

    this.kinematicMovedActors = new Set();
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

    const gravity = this.getGravity();

    const reactionForceValue = mass * gravity.magnitude;
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

  integrateVelocities(options: UpdateOptions): void {
    const deltaTimeInSeconds = options.deltaTime / 1000;

    this.actorQuery.getActors().forEach((actor) => {
      const rigidBody = actor.getComponent(RigidBody);
      const transform = actor.getComponent(Transform);
      const { mass, inverseMass } = rigidBody;

      rigidBody._biasLinearVelocity.multiplyNumber(0);
      rigidBody._prevLinearVelocity.x = rigidBody.linearVelocity.x;
      rigidBody._prevLinearVelocity.y = rigidBody.linearVelocity.y;

      if (rigidBody.disabled) {
        rigidBody._movementTarget = null;
        rigidBody.clearForces();
        return;
      }

      if (rigidBody.type === 'static') {
        return;
      }

      if (rigidBody.type === 'kinematic') {
        const { _movementTarget } = rigidBody;

        if (_movementTarget === null) {
          return;
        }

        rigidBody.linearVelocity.x =
          (_movementTarget.x - transform.world.position.x) / deltaTimeInSeconds;
        rigidBody.linearVelocity.y =
          (_movementTarget.y - transform.world.position.y) / deltaTimeInSeconds;

        this.kinematicMovedActors.add(actor);

        return;
      }

      if (mass <= 0) {
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
        const gravity = this.getGravity();
        force.x += mass * gravity.x * rigidBody.gravityScale;
        force.y += mass * gravity.y * rigidBody.gravityScale;
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

  integrateKinematicPositions(options: UpdateOptions): void {
    const deltaTimeInSeconds = options.deltaTime / 1000;

    this.actorQuery.getActors().forEach((actor) => {
      const rigidBody = actor.getComponent(RigidBody);
      const transform = actor.getComponent(Transform);

      if (
        rigidBody.disabled ||
        rigidBody.type !== 'kinematic' ||
        (!rigidBody.linearVelocity.x && !rigidBody.linearVelocity.y)
      ) {
        return;
      }

      transform.world.position.x +=
        rigidBody.linearVelocity.x * deltaTimeInSeconds;
      transform.world.position.y +=
        rigidBody.linearVelocity.y * deltaTimeInSeconds;
    });
  }

  integrateDynamicPositions(options: UpdateOptions): void {
    const deltaTimeInSeconds = options.deltaTime / 1000;

    this.actorQuery.getActors().forEach((actor) => {
      const rigidBody = actor.getComponent(RigidBody);
      const transform = actor.getComponent(Transform);

      if (rigidBody.disabled || rigidBody.type !== 'dynamic') {
        return;
      }

      if (rigidBody.mass <= 0 || rigidBody.sleeping) {
        return;
      }

      transform.world.position.x +=
        (rigidBody.linearVelocity.x + rigidBody._biasLinearVelocity.x) *
        deltaTimeInSeconds;
      transform.world.position.y +=
        (rigidBody.linearVelocity.y + rigidBody._biasLinearVelocity.y) *
        deltaTimeInSeconds;
    });
  }

  lateUpdate(): void {
    this.kinematicMovedActors.forEach((actor) => {
      const rigidBody = actor.getComponent(RigidBody);
      rigidBody.linearVelocity.multiplyNumber(0);
      rigidBody._movementTarget = null;
    });

    this.kinematicMovedActors.clear();
  }
}

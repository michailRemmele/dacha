import type { UpdateOptions } from '../../../../../engine/system';
import { ActorQuery, type Actor } from '../../../../../engine/actor';
import type { Scene } from '../../../../../engine/scene';
import type { Vector2 } from '../../../../../engine/math-lib';
import { RigidBody } from '../../../../components/rigid-body';
import { Transform } from '../../../../components/transform';
import { Collider } from '../../../../components/collider';

import { calculateInertia } from './mass-properties';

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

  private applyAngularDamping(rigidBody: RigidBody, deltaTime: number): void {
    const { angularDamping, angularVelocity } = rigidBody;

    if (!angularDamping || !angularVelocity) {
      return;
    }

    rigidBody.angularVelocity *= Math.max(0, 1 - angularDamping * deltaTime);
  }

  integrateVelocities(options: UpdateOptions): void {
    const deltaTimeInSeconds = options.deltaTime / 1000;

    this.actorQuery.getActors().forEach((actor) => {
      const rigidBody = actor.getComponent(RigidBody);
      const collider = actor.getComponent(Collider) as Collider | undefined;
      const transform = actor.getComponent(Transform);

      rigidBody._biasLinearVelocity.multiplyNumber(0);
      rigidBody._biasAngularVelocity = 0;
      rigidBody._prevLinearVelocity.x = rigidBody.linearVelocity.x;
      rigidBody._prevLinearVelocity.y = rigidBody.linearVelocity.y;
      rigidBody._prevAngularVelocity = rigidBody.angularVelocity;

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

      if (rigidBody.mass <= 0) {
        rigidBody.clearForces();
        return;
      }

      rigidBody.inertia = calculateInertia(rigidBody.mass, collider, transform);

      rigidBody._pointForces.forEach(({ force, position }) => {
        rigidBody._centralForce.add(force);
        rigidBody._torque +=
          (position.x - transform.world.position.x) * force.y -
          (position.y - transform.world.position.y) * force.x;
      });

      rigidBody._pointImpulses.forEach(({ impulse, position }) => {
        rigidBody._centralImpulse.add(impulse);
        rigidBody._angularImpulse +=
          (position.x - transform.world.position.x) * impulse.y -
          (position.y - transform.world.position.y) * impulse.x;
      });

      const {
        _centralForce,
        _centralImpulse,
        linearVelocity,
        mass,
        inverseMass,
        inverseInertia,
        gravityScale,
        lockRotation,
        sleeping,
      } = rigidBody;

      if (sleeping) {
        if (
          _centralForce.x ||
          _centralForce.y ||
          _centralImpulse.x ||
          _centralImpulse.y ||
          rigidBody._torque ||
          rigidBody._angularImpulse
        ) {
          rigidBody.wakeUp();
        } else {
          return;
        }
      }

      if (gravityScale) {
        const gravity = this.getGravity();
        _centralForce.x += mass * gravity.x * gravityScale;
        _centralForce.y += mass * gravity.y * gravityScale;
      }

      if (_centralForce.x || _centralForce.y) {
        _centralForce.multiplyNumber(deltaTimeInSeconds * inverseMass);
        linearVelocity.add(_centralForce);
      }

      if (_centralImpulse.x || _centralImpulse.y) {
        _centralImpulse.multiplyNumber(inverseMass);
        linearVelocity.add(_centralImpulse);
      }

      if (lockRotation) {
        rigidBody.angularVelocity = 0;
      } else {
        if (rigidBody._torque && inverseInertia > 0) {
          rigidBody.angularVelocity +=
            rigidBody._torque * inverseInertia * deltaTimeInSeconds;
        }

        if (rigidBody._angularImpulse && inverseInertia > 0) {
          rigidBody.angularVelocity +=
            rigidBody._angularImpulse * inverseInertia;
        }

        this.applyAngularDamping(rigidBody, deltaTimeInSeconds);
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

      if (!rigidBody.lockRotation) {
        transform.world.rotation +=
          (rigidBody.angularVelocity + rigidBody._biasAngularVelocity) *
          deltaTimeInSeconds;
      }
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

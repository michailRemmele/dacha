import type { Point, Vector2 } from '../../../../../engine/math-lib';
import { RigidBody } from '../../../../components/rigid-body';
import { Transform } from '../../../../components/transform';

export const getContactRestitution = (
  rigidBody1: RigidBody,
  rigidBody2: RigidBody,
): number => {
  return Math.max(rigidBody1.restitution, rigidBody2.restitution);
};

export const getContactFriction = (
  rigidBody1: RigidBody,
  rigidBody2: RigidBody,
): number => {
  return Math.sqrt(rigidBody1.friction * rigidBody2.friction);
};

export const getVelocityAlongDirection = (
  linearVelocity1: Vector2,
  angularVelocity1: number,
  transform1: Transform,
  linearVelocity2: Vector2,
  angularVelocity2: number,
  transform2: Transform,
  point: Point,
  direction: Point,
): number => {
  const relativePoint1X = point.x - transform1.world.position.x;
  const relativePoint1Y = point.y - transform1.world.position.y;
  const relativePoint2X = point.x - transform2.world.position.x;
  const relativePoint2Y = point.y - transform2.world.position.y;

  const velocity1X = linearVelocity1.x - angularVelocity1 * relativePoint1Y;
  const velocity1Y = linearVelocity1.y + angularVelocity1 * relativePoint1X;
  const velocity2X = linearVelocity2.x - angularVelocity2 * relativePoint2Y;
  const velocity2Y = linearVelocity2.y + angularVelocity2 * relativePoint2X;

  return (
    (velocity2X - velocity1X) * direction.x +
    (velocity2Y - velocity1Y) * direction.y
  );
};

export const getEffectiveMass = (
  inverseMass1: number,
  inverseInertia1: number,
  transform1: Transform,
  inverseMass2: number,
  inverseInertia2: number,
  transform2: Transform,
  point: Point,
  directionX: number,
  directionY: number,
): number => {
  const relativePoint1X = point.x - transform1.world.position.x;
  const relativePoint1Y = point.y - transform1.world.position.y;
  const relativePoint2X = point.x - transform2.world.position.x;
  const relativePoint2Y = point.y - transform2.world.position.y;

  const cross1 = relativePoint1X * directionY - relativePoint1Y * directionX;
  const cross2 = relativePoint2X * directionY - relativePoint2Y * directionX;

  return (
    inverseMass1 +
    inverseMass2 +
    cross1 * cross1 * inverseInertia1 +
    cross2 * cross2 * inverseInertia2
  );
};

export const applyImpulse = (
  rigidBody1: RigidBody,
  transform1: Transform,
  rigidBody2: RigidBody,
  transform2: Transform,
  inverseMass1: number,
  inverseInertia1: number,
  inverseMass2: number,
  inverseInertia2: number,
  point: Point,
  impulseX: number,
  impulseY: number,
): void => {
  if (inverseMass1 > 0) {
    rigidBody1.linearVelocity.x -= impulseX * inverseMass1;
    rigidBody1.linearVelocity.y -= impulseY * inverseMass1;
  }

  if (inverseInertia1 > 0) {
    rigidBody1.angularVelocity -=
      ((point.x - transform1.world.position.x) * impulseY -
        (point.y - transform1.world.position.y) * impulseX) *
      inverseInertia1;
  }

  if (inverseMass2 > 0) {
    rigidBody2.linearVelocity.x += impulseX * inverseMass2;
    rigidBody2.linearVelocity.y += impulseY * inverseMass2;
  }

  if (inverseInertia2 > 0) {
    rigidBody2.angularVelocity +=
      ((point.x - transform2.world.position.x) * impulseY -
        (point.y - transform2.world.position.y) * impulseX) *
      inverseInertia2;
  }
};

export const applyBiasImpulse = (
  rigidBody1: RigidBody,
  transform1: Transform,
  rigidBody2: RigidBody,
  transform2: Transform,
  inverseMass1: number,
  inverseInertia1: number,
  inverseMass2: number,
  inverseInertia2: number,
  point: Point,
  impulseX: number,
  impulseY: number,
): void => {
  if (inverseMass1 > 0) {
    rigidBody1._biasLinearVelocity.x -= impulseX * inverseMass1;
    rigidBody1._biasLinearVelocity.y -= impulseY * inverseMass1;
  }

  if (inverseInertia1 > 0) {
    rigidBody1._biasAngularVelocity -=
      ((point.x - transform1.world.position.x) * impulseY -
        (point.y - transform1.world.position.y) * impulseX) *
      inverseInertia1;
  }

  if (inverseMass2 > 0) {
    rigidBody2._biasLinearVelocity.x += impulseX * inverseMass2;
    rigidBody2._biasLinearVelocity.y += impulseY * inverseMass2;
  }

  if (inverseInertia2 > 0) {
    rigidBody2._biasAngularVelocity +=
      ((point.x - transform2.world.position.x) * impulseY -
        (point.y - transform2.world.position.y) * impulseX) *
      inverseInertia2;
  }
};

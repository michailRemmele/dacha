import type { Vector2 } from '../../../../../engine/math-lib';
import { RigidBody } from '../../../../components/rigid-body';

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

export const getVelocityAlongNormal = (
  velocity1: Vector2,
  velocity2: Vector2,
  normal: Vector2,
): number => {
  const relativeVelocityX = velocity2.x - velocity1.x;
  const relativeVelocityY = velocity2.y - velocity1.y;

  return relativeVelocityX * normal.x + relativeVelocityY * normal.y;
};

export const getInverseMass = (rigidBody: RigidBody): number => {
  if (rigidBody.type === 'static' || rigidBody.type === 'kinematic') {
    return 0;
  }

  return rigidBody.inverseMass;
};

export const applyImpulse = (
  velocity1: Vector2,
  velocity2: Vector2,
  inverseMass1: number,
  inverseMass2: number,
  directionX: number,
  directionY: number,
  impulseMagnitude: number,
): void => {
  const impulseX = directionX * impulseMagnitude;
  const impulseY = directionY * impulseMagnitude;

  if (inverseMass1 > 0) {
    velocity1.x -= impulseX * inverseMass1;
    velocity1.y -= impulseY * inverseMass1;
  }

  if (inverseMass2 > 0) {
    velocity2.x += impulseX * inverseMass2;
    velocity2.y += impulseY * inverseMass2;
  }
};

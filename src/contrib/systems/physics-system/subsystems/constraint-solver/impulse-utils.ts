import type { Vector2 } from '../../../../../engine/math-lib';
import type { RigidBody } from '../../../../components/rigid-body';

import type { ContactPoint, ContactState } from './contact-state-manager';

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

/**
 * Returns the effective mass at a contact point along a unit direction.
 * It represents how strongly the two bodies resist an impulse applied at
 * that point in that direction.
 */
export const getEffectiveMass = (
  invMassA: number,
  invInertiaA: number,
  anchorAX: number,
  anchorAY: number,
  invMassB: number,
  invInertiaB: number,
  anchorBX: number,
  anchorBY: number,
  directionX: number,
  directionY: number,
): number => {
  const crossA = anchorAX * directionY - anchorAY * directionX;
  const crossB = anchorBX * directionY - anchorBY * directionX;

  return (
    invMassA +
    invMassB +
    crossA * crossA * invInertiaA +
    crossB * crossB * invInertiaB
  );
};

/**
 * Relative velocity of body B against body A at a contact point, projected onto
 * a direction, using the supplied velocity fields (live, previous, or bias).
 */
const getRelativeVelocityAtPoint = (
  linearVelocityA: Vector2,
  angularVelocityA: number,
  linearVelocityB: Vector2,
  angularVelocityB: number,
  point: ContactPoint,
  directionX: number,
  directionY: number,
): number => {
  const velocityAX = linearVelocityA.x - angularVelocityA * point.anchorAY;
  const velocityAY = linearVelocityA.y + angularVelocityA * point.anchorAX;
  const velocityBX = linearVelocityB.x - angularVelocityB * point.anchorBY;
  const velocityBY = linearVelocityB.y + angularVelocityB * point.anchorBX;

  return (
    (velocityBX - velocityAX) * directionX +
    (velocityBY - velocityAY) * directionY
  );
};

export const getNormalVelocity = (
  state: ContactState,
  point: ContactPoint,
): number =>
  getRelativeVelocityAtPoint(
    state.bodyA.linearVelocity,
    state.bodyA.angularVelocity,
    state.bodyB.linearVelocity,
    state.bodyB.angularVelocity,
    point,
    state.normalX,
    state.normalY,
  );

export const getTangentVelocity = (
  state: ContactState,
  point: ContactPoint,
): number =>
  getRelativeVelocityAtPoint(
    state.bodyA.linearVelocity,
    state.bodyA.angularVelocity,
    state.bodyB.linearVelocity,
    state.bodyB.angularVelocity,
    point,
    state.tangentX,
    state.tangentY,
  );

export const getPrevNormalVelocity = (
  state: ContactState,
  point: ContactPoint,
): number =>
  getRelativeVelocityAtPoint(
    state.bodyA._prevLinearVelocity,
    state.bodyA._prevAngularVelocity,
    state.bodyB._prevLinearVelocity,
    state.bodyB._prevAngularVelocity,
    point,
    state.normalX,
    state.normalY,
  );

export const getBiasNormalVelocity = (
  state: ContactState,
  point: ContactPoint,
): number =>
  getRelativeVelocityAtPoint(
    state.bodyA._biasLinearVelocity,
    state.bodyA._biasAngularVelocity,
    state.bodyB._biasLinearVelocity,
    state.bodyB._biasAngularVelocity,
    point,
    state.normalX,
    state.normalY,
  );

export const applyImpulse = (
  state: ContactState,
  point: ContactPoint,
  impulseX: number,
  impulseY: number,
): void => {
  const { bodyA, bodyB } = state;

  if (state.invMassA > 0) {
    bodyA.linearVelocity.x -= impulseX * state.invMassA;
    bodyA.linearVelocity.y -= impulseY * state.invMassA;
  }

  if (state.invInertiaA > 0) {
    bodyA.angularVelocity -=
      (point.anchorAX * impulseY - point.anchorAY * impulseX) *
      state.invInertiaA;
  }

  if (state.invMassB > 0) {
    bodyB.linearVelocity.x += impulseX * state.invMassB;
    bodyB.linearVelocity.y += impulseY * state.invMassB;
  }

  if (state.invInertiaB > 0) {
    bodyB.angularVelocity +=
      (point.anchorBX * impulseY - point.anchorBY * impulseX) *
      state.invInertiaB;
  }
};

export const applyBiasImpulse = (
  state: ContactState,
  point: ContactPoint,
  impulseX: number,
  impulseY: number,
): void => {
  const { bodyA, bodyB } = state;

  if (state.invMassA > 0) {
    bodyA._biasLinearVelocity.x -= impulseX * state.invMassA;
    bodyA._biasLinearVelocity.y -= impulseY * state.invMassA;
  }

  if (state.invInertiaA > 0) {
    bodyA._biasAngularVelocity -=
      (point.anchorAX * impulseY - point.anchorAY * impulseX) *
      state.invInertiaA;
  }

  if (state.invMassB > 0) {
    bodyB._biasLinearVelocity.x += impulseX * state.invMassB;
    bodyB._biasLinearVelocity.y += impulseY * state.invMassB;
  }

  if (state.invInertiaB > 0) {
    bodyB._biasAngularVelocity +=
      (point.anchorBX * impulseY - point.anchorBY * impulseX) *
      state.invInertiaB;
  }
};

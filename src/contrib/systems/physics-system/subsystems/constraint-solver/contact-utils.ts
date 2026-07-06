import type { Actor } from '../../../../../engine/actor';
import { type Vector2, VectorOps } from '../../../../../engine/math-lib';
import { RigidBody } from '../../../../components/rigid-body';
import { Transform } from '../../../../components/transform';
import type { Contact } from '../collision-detection/types';
import { SUPPORT_MIN_GRAVITY_DOT } from '../../consts';

import type { ContactState } from './contact-state-manager';
import {
  getContactRestitution,
  getVelocityAlongDirection,
} from './impulse-utils';

const getMinNormalVelocity = (
  contact: Contact,
  usePrevVelocity = true,
): number | null => {
  const rigidBody1 = contact.actor1.getComponent(RigidBody);
  const rigidBody2 = contact.actor2.getComponent(RigidBody);
  const transform1 = contact.actor1.getComponent(Transform);
  const transform2 = contact.actor2.getComponent(Transform);

  let minVelocity: number | null = null;

  for (const point of contact.contactPoints) {
    const velocity = getVelocityAlongDirection(
      usePrevVelocity
        ? rigidBody1._prevLinearVelocity
        : rigidBody1.linearVelocity,
      usePrevVelocity
        ? rigidBody1._prevAngularVelocity
        : rigidBody1.angularVelocity,
      transform1,
      usePrevVelocity
        ? rigidBody2._prevLinearVelocity
        : rigidBody2.linearVelocity,
      usePrevVelocity
        ? rigidBody2._prevAngularVelocity
        : rigidBody2.angularVelocity,
      transform2,
      point,
      contact.normal,
    );

    if (minVelocity === null || velocity < minVelocity) {
      minVelocity = velocity;
    }
  }

  return minVelocity;
};

export const shouldSkipBias = (
  state: ContactState,
  restitutionVelocityThreshold: number,
): boolean => {
  const { contact } = state;
  const rigidBody1 = contact.actor1.getComponent(RigidBody);
  const rigidBody2 = contact.actor2.getComponent(RigidBody);
  const minPreviousNormalVelocity = getMinNormalVelocity(state.contact);

  if (minPreviousNormalVelocity === null) {
    return false;
  }

  return (
    getContactRestitution(rigidBody1, rigidBody2) > 0 &&
    (rigidBody1.inverseMass === 0 || rigidBody2.inverseMass === 0) &&
    -minPreviousNormalVelocity > restitutionVelocityThreshold
  );
};

export const shouldWarmStart = (
  state: ContactState,
  restitutionVelocityThreshold: number,
): boolean => {
  const { contact } = state;
  const rigidBody1 = contact.actor1.getComponent(RigidBody);
  const rigidBody2 = contact.actor2.getComponent(RigidBody);
  const minPreviousNormalVelocity = getMinNormalVelocity(state.contact);

  if (minPreviousNormalVelocity === null) {
    return false;
  }

  return (
    getContactRestitution(rigidBody1, rigidBody2) === 0 ||
    -minPreviousNormalVelocity <= restitutionVelocityThreshold
  );
};

export const shouldWakeSleepingContact = (
  contact: Contact,
  contactSpeedThreshold: number,
): boolean => {
  const minNormalVelocity = getMinNormalVelocity(contact, false);

  return (
    minNormalVelocity !== null && -minNormalVelocity > contactSpeedThreshold
  );
};

export const isSleepSupportContact = (
  contact: Contact,
  actor: Actor,
  gravity: Vector2,
): boolean => {
  const gravityMagnitude = gravity.magnitude;

  if (gravityMagnitude === 0) {
    return false;
  }

  const normalGravityDot = VectorOps.dotProduct(contact.normal, gravity);
  const supportDot =
    contact.actor1 === actor ? normalGravityDot : -normalGravityDot;

  return supportDot / gravityMagnitude > SUPPORT_MIN_GRAVITY_DOT;
};

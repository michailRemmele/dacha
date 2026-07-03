import { RigidBody } from '../../../../components/rigid-body';
import { Transform } from '../../../../components/transform';

import type { ContactState } from './contact-state-manager';
import {
  getContactRestitution,
  getVelocityAlongDirection,
} from './impulse-utils';

const getMinPreviousNormalVelocity = (state: ContactState): number | null => {
  const { contact } = state;
  const rigidBody1 = contact.actor1.getComponent(RigidBody);
  const rigidBody2 = contact.actor2.getComponent(RigidBody);
  const transform1 = contact.actor1.getComponent(Transform);
  const transform2 = contact.actor2.getComponent(Transform);

  let minVelocity: number | null = null;

  for (const point of contact.contactPoints) {
    const velocity = getVelocityAlongDirection(
      rigidBody1._prevLinearVelocity,
      rigidBody1._prevAngularVelocity,
      transform1,
      rigidBody2._prevLinearVelocity,
      rigidBody2._prevAngularVelocity,
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
  const minPreviousNormalVelocity = getMinPreviousNormalVelocity(state);

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
  const minPreviousNormalVelocity = getMinPreviousNormalVelocity(state);

  if (minPreviousNormalVelocity === null) {
    return false;
  }

  return (
    getContactRestitution(rigidBody1, rigidBody2) === 0 ||
    -minPreviousNormalVelocity <= restitutionVelocityThreshold
  );
};

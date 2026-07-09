import type { Actor } from '../../../../../engine/actor';
import { type Vector2, VectorOps } from '../../../../../engine/math-lib';
import { RigidBody } from '../../../../components/rigid-body';
import { Transform } from '../../../../components/transform';
import type { Contact } from '../collision-detection/types';
import { SUPPORT_MIN_GRAVITY_DOT } from '../../consts';

const getMinNormalVelocity = (contact: Contact): number | null => {
  const rigidBody1 = contact.actor1.getComponent(RigidBody);
  const rigidBody2 = contact.actor2.getComponent(RigidBody);
  const transform1 = contact.actor1.getComponent(Transform);
  const transform2 = contact.actor2.getComponent(Transform);
  const { normal } = contact;

  let minVelocity: number | null = null;

  for (const point of contact.contactPoints) {
    const anchor1X = point.x - transform1.world.position.x;
    const anchor1Y = point.y - transform1.world.position.y;
    const anchor2X = point.x - transform2.world.position.x;
    const anchor2Y = point.y - transform2.world.position.y;

    const velocity1X =
      rigidBody1.linearVelocity.x - rigidBody1.angularVelocity * anchor1Y;
    const velocity1Y =
      rigidBody1.linearVelocity.y + rigidBody1.angularVelocity * anchor1X;
    const velocity2X =
      rigidBody2.linearVelocity.x - rigidBody2.angularVelocity * anchor2Y;
    const velocity2Y =
      rigidBody2.linearVelocity.y + rigidBody2.angularVelocity * anchor2X;

    const velocity =
      (velocity2X - velocity1X) * normal.x +
      (velocity2Y - velocity1Y) * normal.y;

    if (minVelocity === null || velocity < minVelocity) {
      minVelocity = velocity;
    }
  }

  return minVelocity;
};

export const shouldWakeSleepingContact = (
  contact: Contact,
  contactSpeedThreshold: number,
): boolean => {
  const minNormalVelocity = getMinNormalVelocity(contact);

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

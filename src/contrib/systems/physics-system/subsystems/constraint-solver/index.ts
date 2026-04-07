import type { Actor } from '../../../../../engine/actor';
import { RigidBody } from '../../../../components/rigid-body';
import { Transform } from '../../../../components/transform';
import { RIGID_BODY_TYPE } from '../../consts';
import type { Contact } from '../collision-detection/types';

const SOLVER_ITERATIONS = 8;
const POSITION_CORRECTION_PERCENT = 0.8;
const PENETRATION_SLOP = 0.01;
const DEFAULT_CONTACT_FRICTION = 0.6;

export class ConstraintSolver {
  private validContacts: Contact[] = [];

  private validateCollision(actor1: Actor, actor2: Actor): boolean {
    const rigidBody1 = actor1.getComponent(RigidBody) as RigidBody | undefined;
    const rigidBody2 = actor2.getComponent(RigidBody) as RigidBody | undefined;

    if (!rigidBody1 || !rigidBody2) {
      return false;
    }

    if (
      rigidBody1.type === RIGID_BODY_TYPE.STATIC &&
      rigidBody2.type === RIGID_BODY_TYPE.STATIC
    ) {
      return false;
    }
    return true;
  }

  private getInverseMass(rigidBody: RigidBody): number {
    if (rigidBody.disabled || rigidBody.type === RIGID_BODY_TYPE.STATIC) {
      return 0;
    }

    return rigidBody.inverseMass;
  }

  private applyNormalImpulse(contact: Contact): number {
    const { actor1, actor2, normal } = contact;
    const rigidBody1 = actor1.getComponent(RigidBody);
    const rigidBody2 = actor2.getComponent(RigidBody);
    const inverseMass1 = this.getInverseMass(rigidBody1);
    const inverseMass2 = this.getInverseMass(rigidBody2);
    const inverseMassSum = inverseMass1 + inverseMass2;

    if (inverseMassSum === 0) {
      return 0;
    }

    const relativeVelocityX =
      rigidBody2.linearVelocity.x - rigidBody1.linearVelocity.x;
    const relativeVelocityY =
      rigidBody2.linearVelocity.y - rigidBody1.linearVelocity.y;
    const velocityAlongNormal =
      relativeVelocityX * normal.x + relativeVelocityY * normal.y;

    if (velocityAlongNormal >= 0) {
      return 0;
    }

    const impulseMagnitude = -velocityAlongNormal / inverseMassSum;

    const impulseX = normal.x * impulseMagnitude;
    const impulseY = normal.y * impulseMagnitude;

    if (inverseMass1 > 0) {
      rigidBody1.linearVelocity.x -= impulseX * inverseMass1;
      rigidBody1.linearVelocity.y -= impulseY * inverseMass1;
    }

    if (inverseMass2 > 0) {
      rigidBody2.linearVelocity.x += impulseX * inverseMass2;
      rigidBody2.linearVelocity.y += impulseY * inverseMass2;
    }

    return impulseMagnitude;
  }

  private applyFrictionImpulse(
    contact: Contact,
    normalImpulseMagnitude: number,
  ): void {
    if (normalImpulseMagnitude <= 0) {
      return;
    }

    const { normal } = contact;
    const rigidBody1 = contact.actor1.getComponent(RigidBody);
    const rigidBody2 = contact.actor2.getComponent(RigidBody);
    const inverseMass1 = this.getInverseMass(rigidBody1);
    const inverseMass2 = this.getInverseMass(rigidBody2);
    const inverseMassSum = inverseMass1 + inverseMass2;

    if (inverseMassSum === 0) {
      return;
    }

    const relativeVelocityX =
      rigidBody2.linearVelocity.x - rigidBody1.linearVelocity.x;
    const relativeVelocityY =
      rigidBody2.linearVelocity.y - rigidBody1.linearVelocity.y;
    const velocityAlongNormal =
      relativeVelocityX * normal.x + relativeVelocityY * normal.y;
    const tangentX = relativeVelocityX - normal.x * velocityAlongNormal;
    const tangentY = relativeVelocityY - normal.y * velocityAlongNormal;
    const tangentMagnitude = Math.sqrt(tangentX ** 2 + tangentY ** 2);

    if (tangentMagnitude === 0) {
      return;
    }

    const normalizedTangentX = tangentX / tangentMagnitude;
    const normalizedTangentY = tangentY / tangentMagnitude;
    const velocityAlongTangent =
      relativeVelocityX * normalizedTangentX +
      relativeVelocityY * normalizedTangentY;
    const unclampedImpulseMagnitude = -velocityAlongTangent / inverseMassSum;
    const maxFrictionImpulseMagnitude =
      DEFAULT_CONTACT_FRICTION * normalImpulseMagnitude;
    const impulseMagnitude = Math.max(
      -maxFrictionImpulseMagnitude,
      Math.min(unclampedImpulseMagnitude, maxFrictionImpulseMagnitude),
    );

    const impulseX = normalizedTangentX * impulseMagnitude;
    const impulseY = normalizedTangentY * impulseMagnitude;

    if (inverseMass1 > 0) {
      rigidBody1.linearVelocity.x -= impulseX * inverseMass1;
      rigidBody1.linearVelocity.y -= impulseY * inverseMass1;
    }

    if (inverseMass2 > 0) {
      rigidBody2.linearVelocity.x += impulseX * inverseMass2;
      rigidBody2.linearVelocity.y += impulseY * inverseMass2;
    }
  }

  private applyPositionCorrection(contact: Contact): void {
    const { actor1, actor2, normal, penetration } = contact;
    const rigidBody1 = actor1.getComponent(RigidBody);
    const rigidBody2 = actor2.getComponent(RigidBody);
    const inverseMass1 = this.getInverseMass(rigidBody1);
    const inverseMass2 = this.getInverseMass(rigidBody2);
    const inverseMassSum = inverseMass1 + inverseMass2;

    if (inverseMassSum === 0) {
      return;
    }

    const correctionMagnitude =
      (Math.max(penetration - PENETRATION_SLOP, 0) *
        POSITION_CORRECTION_PERCENT) /
      inverseMassSum;

    if (correctionMagnitude === 0) {
      return;
    }

    const correctionX = normal.x * correctionMagnitude;
    const correctionY = normal.y * correctionMagnitude;

    const transform1 = actor1.getComponent(Transform);
    const transform2 = actor2.getComponent(Transform);

    if (inverseMass1 > 0) {
      transform1.world.position.x -= correctionX * inverseMass1;
      transform1.world.position.y -= correctionY * inverseMass1;
    }

    if (inverseMass2 > 0) {
      transform2.world.position.x += correctionX * inverseMass2;
      transform2.world.position.y += correctionY * inverseMass2;
    }
  }

  update(contacts: Contact[]): void {
    let validContactsCount = 0;

    contacts.forEach((contact) => {
      if (!this.validateCollision(contact.actor1, contact.actor2)) {
        return;
      }

      this.validContacts[validContactsCount] = contact;
      validContactsCount += 1;
    });

    this.validContacts.length = validContactsCount;

    for (let iteration = 0; iteration < SOLVER_ITERATIONS; iteration += 1) {
      this.validContacts.forEach((contact) => {
        const normalImpulseMagnitude = this.applyNormalImpulse(contact);

        this.applyFrictionImpulse(contact, normalImpulseMagnitude);
      });
    }

    this.validContacts.forEach((contact) => {
      this.applyPositionCorrection(contact);
    });
  }
}

import type { Actor } from '../../../../../engine/actor';
import { VectorOps, type Point } from '../../../../../engine/math-lib';
import { RigidBody } from '../../../../components/rigid-body';
import { Transform } from '../../../../components/transform';
import type { Contact } from '../collision-detection/types';

const SOLVER_ITERATIONS = 8;
const POSITION_CORRECTION_PERCENT = 0.8;
const PENETRATION_SLOP = 0.01;
const DEFAULT_CONTACT_FRICTION = 0.6;

export class ConstraintSolver {
  private validContacts: Contact[] = [];
  private ignoredOneWayContacts = new Map<Actor, Map<Actor, number>>();
  private oneWayContactUpdateIndex = 0;

  private validateCollision(actor1: Actor, actor2: Actor): boolean {
    const rigidBody1 = actor1.getComponent(RigidBody) as RigidBody | undefined;
    const rigidBody2 = actor2.getComponent(RigidBody) as RigidBody | undefined;

    if (!rigidBody1 || !rigidBody2) {
      return false;
    }

    if (rigidBody1.disabled || rigidBody2.disabled) {
      return false;
    }

    if (rigidBody1.type === 'static' && rigidBody2.type === 'static') {
      return false;
    }
    return true;
  }

  private trackOneWayContact(oneWayActor: Actor, otherActor: Actor): void {
    let ignoredContacts = this.ignoredOneWayContacts.get(oneWayActor);

    if (!ignoredContacts) {
      ignoredContacts = new Map();
      this.ignoredOneWayContacts.set(oneWayActor, ignoredContacts);
    }

    ignoredContacts.set(otherActor, this.oneWayContactUpdateIndex);
  }

  private validateOneWayColliderContact(
    oneWayActor: Actor,
    otherActor: Actor,
    normal: Point,
  ): boolean {
    if (this.ignoredOneWayContacts.get(oneWayActor)?.has(otherActor)) {
      this.trackOneWayContact(oneWayActor, otherActor);
      return false;
    }

    const rigidBody = oneWayActor.getComponent(RigidBody);
    const transform = oneWayActor.getComponent(Transform);

    const oneWayNormal = VectorOps.rotatePoint(
      rigidBody.oneWayNormal!,
      transform.world.rotation,
    );

    if (VectorOps.dotProduct(oneWayNormal, normal) > 0) {
      return true;
    }

    this.trackOneWayContact(oneWayActor, otherActor);

    return false;
  }

  private validateOneWayContact(contact: Contact): boolean {
    const rigidBody1 = contact.actor1.getComponent(RigidBody);
    const rigidBody2 = contact.actor2.getComponent(RigidBody);

    if (
      rigidBody1.oneWay &&
      !this.validateOneWayColliderContact(
        contact.actor1,
        contact.actor2,
        contact.normal,
      )
    ) {
      return false;
    }

    if (!rigidBody2.oneWay) {
      return true;
    }

    return this.validateOneWayColliderContact(contact.actor2, contact.actor1, {
      x: -contact.normal.x,
      y: -contact.normal.y,
    });
  }

  private clearOneWayContacts(): void {
    this.ignoredOneWayContacts.forEach((ignoredContacts, oneWayActor) => {
      ignoredContacts.forEach((lastSeenUpdate, otherActor) => {
        if (lastSeenUpdate !== this.oneWayContactUpdateIndex) {
          ignoredContacts.delete(otherActor);
        }
      });

      if (ignoredContacts.size === 0) {
        this.ignoredOneWayContacts.delete(oneWayActor);
      }
    });

    if (this.ignoredOneWayContacts.size === 0) {
      this.oneWayContactUpdateIndex = 0;
    }
  }

  private getInverseMass(rigidBody: RigidBody): number {
    if (rigidBody.type === 'static' || rigidBody.type === 'kinematic') {
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
    this.oneWayContactUpdateIndex += 1;
    let validContactsCount = 0;

    contacts.forEach((contact) => {
      if (!this.validateCollision(contact.actor1, contact.actor2)) {
        return;
      }
      if (!this.validateOneWayContact(contact)) {
        return;
      }

      this.validContacts[validContactsCount] = contact;
      validContactsCount += 1;
    });

    this.validContacts.length = validContactsCount;

    this.clearOneWayContacts();

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

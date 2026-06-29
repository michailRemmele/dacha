import type { Actor } from '../../../../../engine/actor';
import type { UpdateOptions } from '../../../../../engine/system';
import { RigidBody } from '../../../../components/rigid-body';
import type { Contact } from '../collision-detection/types';

import { OneWayValidator } from './one-way-validator';
import {
  getContactFriction,
  getContactRestitution,
  getVelocityAlongNormal,
  getInverseMass,
  applyImpulse,
} from './utils';

const SOLVER_ITERATIONS = 8;
const CONTACT_BIAS = 0.8;
const CONTACT_MAX_ALLOWED_PENETRATION = 0.1;
const MAX_BIAS_VELOCITY = 120;
const RESTITUTION_VELOCITY_THRESHOLD = 1;

export class ConstraintSolver {
  private validContacts: Contact[];
  private oneWayValidator: OneWayValidator;

  constructor() {
    this.validContacts = [];
    this.oneWayValidator = new OneWayValidator();
  }

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

  private validateOneWayContact(contact: Contact): boolean {
    const rigidBody1 = contact.actor1.getComponent(RigidBody);
    const rigidBody2 = contact.actor2.getComponent(RigidBody);

    if (
      rigidBody1.oneWay &&
      rigidBody2.type === 'dynamic' &&
      !this.oneWayValidator.shouldBlock(
        contact.actor1,
        contact.actor2,
        contact.normal,
      )
    ) {
      return false;
    }

    if (!rigidBody2.oneWay || rigidBody1.type !== 'dynamic') {
      return true;
    }

    return this.oneWayValidator.shouldBlock(contact.actor2, contact.actor1, {
      x: -contact.normal.x,
      y: -contact.normal.y,
    });
  }

  private shouldSkipBias(contact: Contact): boolean {
    const rigidBody1 = contact.actor1.getComponent(RigidBody);
    const rigidBody2 = contact.actor2.getComponent(RigidBody);

    return (
      getContactRestitution(rigidBody1, rigidBody2) > 0 &&
      (getInverseMass(rigidBody1) === 0 || getInverseMass(rigidBody2) === 0) &&
      -getVelocityAlongNormal(
        rigidBody1._prevLinearVelocity,
        rigidBody2._prevLinearVelocity,
        contact.normal,
      ) > RESTITUTION_VELOCITY_THRESHOLD
    );
  }

  private applyNormalImpulse(contact: Contact): number {
    const { actor1, actor2, normal } = contact;
    const rigidBody1 = actor1.getComponent(RigidBody);
    const rigidBody2 = actor2.getComponent(RigidBody);
    const inverseMass1 = getInverseMass(rigidBody1);
    const inverseMass2 = getInverseMass(rigidBody2);
    const inverseMassSum = inverseMass1 + inverseMass2;

    if (inverseMassSum === 0) {
      return 0;
    }

    const velocityAlongNormal = getVelocityAlongNormal(
      rigidBody1.linearVelocity,
      rigidBody2.linearVelocity,
      normal,
    );
    const prevVelocityAlongNormal = getVelocityAlongNormal(
      rigidBody1._prevLinearVelocity,
      rigidBody2._prevLinearVelocity,
      normal,
    );

    if (velocityAlongNormal >= 0) {
      return 0;
    }

    const contactRestitution = getContactRestitution(rigidBody1, rigidBody2);
    const restitution =
      -prevVelocityAlongNormal > RESTITUTION_VELOCITY_THRESHOLD
        ? contactRestitution
        : 0;
    const impulseMagnitude =
      -(velocityAlongNormal + restitution * prevVelocityAlongNormal) /
      inverseMassSum;

    applyImpulse(
      rigidBody1.linearVelocity,
      rigidBody2.linearVelocity,
      inverseMass1,
      inverseMass2,
      normal.x,
      normal.y,
      impulseMagnitude,
    );

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
    const inverseMass1 = getInverseMass(rigidBody1);
    const inverseMass2 = getInverseMass(rigidBody2);
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
    const friction = getContactFriction(rigidBody1, rigidBody2);
    const maxFrictionImpulseMagnitude = friction * normalImpulseMagnitude;
    const impulseMagnitude = Math.max(
      -maxFrictionImpulseMagnitude,
      Math.min(unclampedImpulseMagnitude, maxFrictionImpulseMagnitude),
    );

    applyImpulse(
      rigidBody1.linearVelocity,
      rigidBody2.linearVelocity,
      inverseMass1,
      inverseMass2,
      normalizedTangentX,
      normalizedTangentY,
      impulseMagnitude,
    );
  }

  private applyBiasImpulse(contact: Contact, deltaTimeInSeconds: number): void {
    const { actor1, actor2, normal, penetration } = contact;
    const rigidBody1 = actor1.getComponent(RigidBody);
    const rigidBody2 = actor2.getComponent(RigidBody);
    const inverseMass1 = getInverseMass(rigidBody1);
    const inverseMass2 = getInverseMass(rigidBody2);
    const inverseMassSum = inverseMass1 + inverseMass2;

    if (inverseMassSum === 0 || deltaTimeInSeconds <= 0) {
      return;
    }

    const targetBiasVelocity = Math.min(
      (Math.max(penetration - CONTACT_MAX_ALLOWED_PENETRATION, 0) *
        CONTACT_BIAS) /
        deltaTimeInSeconds,
      MAX_BIAS_VELOCITY,
    );

    if (targetBiasVelocity === 0) {
      return;
    }

    const biasVelocityAlongNormal = getVelocityAlongNormal(
      rigidBody1._biasLinearVelocity,
      rigidBody2._biasLinearVelocity,
      normal,
    );
    const impulseMagnitude =
      (targetBiasVelocity - biasVelocityAlongNormal) / inverseMassSum;

    if (impulseMagnitude <= 0) {
      return;
    }

    applyImpulse(
      rigidBody1._biasLinearVelocity,
      rigidBody2._biasLinearVelocity,
      inverseMass1,
      inverseMass2,
      normal.x,
      normal.y,
      impulseMagnitude,
    );
  }

  update(contacts: Contact[], options: UpdateOptions): void {
    this.oneWayValidator.update();

    const deltaTimeInSeconds = options.deltaTime / 1000;
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

    for (let iteration = 0; iteration < SOLVER_ITERATIONS; iteration += 1) {
      this.validContacts.forEach((contact) => {
        if (!this.shouldSkipBias(contact)) {
          this.applyBiasImpulse(contact, deltaTimeInSeconds);
        }

        const normalImpulseMagnitude = this.applyNormalImpulse(contact);

        this.applyFrictionImpulse(contact, normalImpulseMagnitude);
      });
    }

    this.oneWayValidator.lateUpdate();
  }
}

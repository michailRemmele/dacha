import type { Actor } from '../../../../../engine/actor';
import type { UpdateOptions } from '../../../../../engine/system';
import { RigidBody } from '../../../../components/rigid-body';
import { Transform } from '../../../../components/transform';
import type { Contact } from '../collision-detection/types';

import { OneWayValidator } from './one-way-validator';
import {
  getContactFriction,
  getContactRestitution,
  getVelocityAlongDirection,
  getEffectiveMass,
  applyImpulse,
  applyBiasImpulse,
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
    const transform1 = contact.actor1.getComponent(Transform);
    const transform2 = contact.actor2.getComponent(Transform);
    const point = contact.contactPoints[0];

    if (!point) {
      return false;
    }

    return (
      getContactRestitution(rigidBody1, rigidBody2) > 0 &&
      (rigidBody1.inverseMass === 0 || rigidBody2.inverseMass === 0) &&
      -getVelocityAlongDirection(
        rigidBody1._prevLinearVelocity,
        rigidBody1._prevAngularVelocity,
        transform1,
        rigidBody2._prevLinearVelocity,
        rigidBody2._prevAngularVelocity,
        transform2,
        point,
        contact.normal,
      ) > RESTITUTION_VELOCITY_THRESHOLD
    );
  }

  private applyNormalImpulse(contact: Contact): number {
    const { actor1, actor2, normal, contactPoints } = contact;
    const rigidBody1 = actor1.getComponent(RigidBody);
    const rigidBody2 = actor2.getComponent(RigidBody);
    const transform1 = actor1.getComponent(Transform);
    const transform2 = actor2.getComponent(Transform);
    const inverseMass1 = rigidBody1.inverseMass;
    const inverseMass2 = rigidBody2.inverseMass;
    const inverseInertia1 = rigidBody1.inverseInertia;
    const inverseInertia2 = rigidBody2.inverseInertia;
    let totalImpulseMagnitude = 0;

    if (inverseMass1 + inverseMass2 + inverseInertia1 + inverseInertia2 === 0) {
      return 0;
    }

    contactPoints.forEach((point) => {
      const effectiveMass = getEffectiveMass(
        inverseMass1,
        inverseInertia1,
        transform1,
        inverseMass2,
        inverseInertia2,
        transform2,
        point,
        normal.x,
        normal.y,
      );

      if (effectiveMass === 0) {
        return;
      }

      const velocityAlongNormal = getVelocityAlongDirection(
        rigidBody1.linearVelocity,
        rigidBody1.angularVelocity,
        transform1,
        rigidBody2.linearVelocity,
        rigidBody2.angularVelocity,
        transform2,
        point,
        normal,
      );
      const prevVelocityAlongNormal = getVelocityAlongDirection(
        rigidBody1._prevLinearVelocity,
        rigidBody1._prevAngularVelocity,
        transform1,
        rigidBody2._prevLinearVelocity,
        rigidBody2._prevAngularVelocity,
        transform2,
        point,
        normal,
      );

      if (velocityAlongNormal >= 0) {
        return;
      }

      const contactRestitution = getContactRestitution(rigidBody1, rigidBody2);
      const restitution =
        -prevVelocityAlongNormal > RESTITUTION_VELOCITY_THRESHOLD
          ? contactRestitution
          : 0;
      const impulseMagnitude =
        -(velocityAlongNormal + restitution * prevVelocityAlongNormal) /
        effectiveMass;

      applyImpulse(
        rigidBody1,
        transform1,
        rigidBody2,
        transform2,
        inverseMass1,
        inverseInertia1,
        inverseMass2,
        inverseInertia2,
        point,
        normal.x * impulseMagnitude,
        normal.y * impulseMagnitude,
      );

      totalImpulseMagnitude += impulseMagnitude;
    });

    return totalImpulseMagnitude;
  }

  private applyFrictionImpulse(
    contact: Contact,
    normalImpulseMagnitude: number,
  ): void {
    if (normalImpulseMagnitude <= 0) {
      return;
    }

    const { actor1, actor2, normal, contactPoints } = contact;
    const rigidBody1 = actor1.getComponent(RigidBody);
    const rigidBody2 = actor2.getComponent(RigidBody);
    const transform1 = actor1.getComponent(Transform);
    const transform2 = actor2.getComponent(Transform);
    const inverseMass1 = rigidBody1.inverseMass;
    const inverseMass2 = rigidBody2.inverseMass;
    const inverseInertia1 = rigidBody1.inverseInertia;
    const inverseInertia2 = rigidBody2.inverseInertia;

    if (inverseMass1 + inverseMass2 + inverseInertia1 + inverseInertia2 === 0) {
      return;
    }

    contactPoints.forEach((point) => {
      const relativeVelocityX =
        rigidBody2.linearVelocity.x -
        rigidBody2.angularVelocity * (point.y - transform2.world.position.y) -
        (rigidBody1.linearVelocity.x -
          rigidBody1.angularVelocity * (point.y - transform1.world.position.y));
      const relativeVelocityY =
        rigidBody2.linearVelocity.y +
        rigidBody2.angularVelocity * (point.x - transform2.world.position.x) -
        (rigidBody1.linearVelocity.y +
          rigidBody1.angularVelocity * (point.x - transform1.world.position.x));
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
      const effectiveMass = getEffectiveMass(
        inverseMass1,
        inverseInertia1,
        transform1,
        inverseMass2,
        inverseInertia2,
        transform2,
        point,
        normalizedTangentX,
        normalizedTangentY,
      );

      if (effectiveMass === 0) {
        return;
      }

      const velocityAlongTangent =
        relativeVelocityX * normalizedTangentX +
        relativeVelocityY * normalizedTangentY;
      const unclampedImpulseMagnitude = -velocityAlongTangent / effectiveMass;
      const friction = getContactFriction(rigidBody1, rigidBody2);
      const maxFrictionImpulseMagnitude = friction * normalImpulseMagnitude;
      const impulseMagnitude = Math.max(
        -maxFrictionImpulseMagnitude,
        Math.min(unclampedImpulseMagnitude, maxFrictionImpulseMagnitude),
      );

      applyImpulse(
        rigidBody1,
        transform1,
        rigidBody2,
        transform2,
        inverseMass1,
        inverseInertia1,
        inverseMass2,
        inverseInertia2,
        point,
        normalizedTangentX * impulseMagnitude,
        normalizedTangentY * impulseMagnitude,
      );
    });
  }

  private applyBiasImpulse(contact: Contact, deltaTimeInSeconds: number): void {
    const { actor1, actor2, normal, contactPoints, penetration } = contact;
    const rigidBody1 = actor1.getComponent(RigidBody);
    const rigidBody2 = actor2.getComponent(RigidBody);
    const transform1 = actor1.getComponent(Transform);
    const transform2 = actor2.getComponent(Transform);
    const inverseMass1 = rigidBody1.inverseMass;
    const inverseMass2 = rigidBody2.inverseMass;
    const inverseInertia1 = rigidBody1.inverseInertia;
    const inverseInertia2 = rigidBody2.inverseInertia;

    if (inverseMass1 + inverseMass2 + inverseInertia1 + inverseInertia2 === 0) {
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

    contactPoints.forEach((point) => {
      const effectiveMass = getEffectiveMass(
        inverseMass1,
        inverseInertia1,
        transform1,
        inverseMass2,
        inverseInertia2,
        transform2,
        point,
        normal.x,
        normal.y,
      );

      if (effectiveMass === 0) {
        return;
      }

      const biasVelocityAlongNormal = getVelocityAlongDirection(
        rigidBody1._biasLinearVelocity,
        rigidBody1._biasAngularVelocity,
        transform1,
        rigidBody2._biasLinearVelocity,
        rigidBody2._biasAngularVelocity,
        transform2,
        point,
        normal,
      );
      const impulseMagnitude =
        (targetBiasVelocity - biasVelocityAlongNormal) / effectiveMass;

      if (impulseMagnitude <= 0) {
        return;
      }

      applyBiasImpulse(
        rigidBody1,
        transform1,
        rigidBody2,
        transform2,
        inverseMass1,
        inverseInertia1,
        inverseMass2,
        inverseInertia2,
        point,
        normal.x * impulseMagnitude,
        normal.y * impulseMagnitude,
      );
    });
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

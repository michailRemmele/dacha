import { ActorQuery } from '../../../engine/actor';
import type { Actor } from '../../../engine/actor';
import { SceneSystem } from '../../../engine/system';
import type { SceneSystemOptions, UpdateOptions } from '../../../engine/system';
import { Vector2, VectorOps, type Point } from '../../../engine/math-lib';
import {
  Collider,
  CharacterBody,
  RigidBody,
  Transform,
} from '../../components';
import { PhysicsAPI } from '../physics-system';
import type { CastHit, OverlapHit } from '../physics-system/types';
import { OneWayValidator } from '../../utils/one-way-validator';
import { CharacterHit } from '../../events';

import { clipAgainstNormal } from './utils';

const DISTANCE_EPSILON = 0.000001;
const SNAP_EPSILON = 0.000001;

type CharacterHitKind = 'ground' | 'wall' | 'ceiling';

/**
 * Kinematic character controller system with sweep/slide collision movement.
 *
 * The system expects actors to have `CharacterBody`, `Transform`,
 * `Collider`, and a kinematic `RigidBody`. Put this system before
 * `PhysicsSystem` in system configuration so `movePosition()` targets are
 * consumed by physics in the same fixed step.
 *
 * @category Systems
 */
export class CharacterController extends SceneSystem {
  private actorQuery: ActorQuery;
  private world: SceneSystemOptions['world'];

  private oneWayValidator: OneWayValidator;

  constructor(options: SceneSystemOptions) {
    super();

    this.world = options.world;
    this.actorQuery = new ActorQuery({
      scene: options.scene,
      filter: [CharacterBody, Transform, Collider, RigidBody],
    });

    this.oneWayValidator = new OneWayValidator();
  }

  onSceneDestroy(): void {
    this.actorQuery.destroy();
  }

  private isBlockingHit(actor: Actor, hit: CastHit): boolean {
    const rigidBody = hit.actor.getComponent(RigidBody) as
      | RigidBody
      | undefined;

    if (!rigidBody || rigidBody.disabled) {
      return false;
    }

    if (!rigidBody?.oneWay || !rigidBody.oneWayNormal) {
      return true;
    }

    return this.oneWayValidator.validate(hit.actor, actor, hit.normal);
  }

  private isWalkable(actor: Actor, normal: Point): boolean {
    const character = actor.getComponent(CharacterBody);
    return (
      VectorOps.dotProduct(normal, character.upDirection) >=
      Math.cos(character.maxSlopeAngle)
    );
  }

  private isRecoverableOverlap(actor: Actor, hit: OverlapHit): boolean {
    const rigidBody = hit.actor.getComponent(RigidBody) as
      | RigidBody
      | undefined;

    if (!rigidBody || rigidBody.disabled || rigidBody.type === 'dynamic') {
      return false;
    }

    if (!rigidBody.oneWay || !rigidBody.oneWayNormal) {
      return true;
    }

    return this.oneWayValidator.validate(hit.actor, actor, hit.normal);
  }

  private resetGroundState(character: CharacterBody): void {
    if (character.onGround) {
      character.groundActor = null;
      character.groundNormal = character.upDirection.clone();
      character.onGround = false;
    }
  }

  private resetState(character: CharacterBody): void {
    this.resetGroundState(character);
    character.onWall = false;
    character.onCeiling = false;
  }

  private castAll(
    actor: Actor,
    position: Point,
    displacement: Vector2,
  ): CastHit[] {
    const physicsApi = this.world.systemApi.get(PhysicsAPI);

    const character = actor.getComponent(CharacterBody);
    const transform = actor.getComponent(Transform);

    const distance = displacement.magnitude;

    if (distance <= DISTANCE_EPSILON) {
      return [];
    }

    return physicsApi.castActorAll({
      actor,
      offset: {
        x: position.x - transform.world.position.x,
        y: position.y - transform.world.position.y,
      },
      direction: displacement,
      maxDistance: distance + character.skinWidth,
    });
  }

  private cast(
    actor: Actor,
    position: Point,
    displacement: Vector2,
  ): CastHit | null {
    const hits = this.castAll(actor, position, displacement);

    for (const hit of hits) {
      if (
        hit.distance <= DISTANCE_EPSILON &&
        VectorOps.dotProduct(displacement, hit.normal) > DISTANCE_EPSILON
      ) {
        continue;
      }

      if (this.isBlockingHit(actor, hit)) {
        return hit;
      }
    }

    return null;
  }

  private castGround(
    actor: Actor,
    position: Point,
    displacement: Vector2,
  ): CastHit | null {
    const hits = this.castAll(actor, position, displacement);

    for (const hit of hits) {
      if (
        this.isBlockingHit(actor, hit) &&
        this.isWalkable(actor, hit.normal)
      ) {
        return hit;
      }
    }

    return null;
  }

  private recoverOverlaps(actor: Actor, position: Vector2): void {
    const physicsApi = this.world.systemApi.get(PhysicsAPI);
    const character = actor.getComponent(CharacterBody);
    const transform = actor.getComponent(Transform);

    for (let i = 0; i < character.maxRecoveries; i += 1) {
      const hits = physicsApi.overlapActor({
        actor,
        offset: {
          x: position.x - transform.world.position.x,
          y: position.y - transform.world.position.y,
        },
      });
      let recovered = false;

      for (const hit of hits) {
        if (!this.isRecoverableOverlap(actor, hit)) {
          continue;
        }

        const correction = hit.penetration + character.skinWidth;

        if (correction <= DISTANCE_EPSILON) {
          continue;
        }

        position.x += hit.normal.x * correction;
        position.y += hit.normal.y * correction;

        recovered = true;
      }

      if (!recovered) {
        break;
      }
    }
  }

  private handleHit(actor: Actor, hit: CastHit): void {
    const character = actor.getComponent(CharacterBody);

    const upDot = VectorOps.dotProduct(hit.normal, character.upDirection);
    const threshold = Math.cos(character.maxSlopeAngle);
    let kind: CharacterHitKind;

    if (upDot >= threshold) {
      kind = 'ground';
      character.onGround = true;
      character.groundNormal = hit.normal;
      character.groundActor = hit.actor;
    } else if (upDot <= -threshold) {
      kind = 'ceiling';
      character.onCeiling = true;
    } else {
      kind = 'wall';
      character.onWall = true;
    }

    actor.dispatchEvent(CharacterHit, {
      actor: hit.actor,
      point: hit.point,
      normal: hit.normal,
      distance: hit.distance,
      kind,
    });
  }

  private move(actor: Actor, position: Vector2, displacement: Vector2): void {
    const character = actor.getComponent(CharacterBody);

    for (let i = 0; i < character.maxSlides; i += 1) {
      const distance = displacement.magnitude;

      if (distance <= DISTANCE_EPSILON) {
        break;
      }

      const hit = this.cast(actor, position, displacement);

      if (!hit) {
        position.add(displacement);
        break;
      }

      const safeDistance = Math.max(hit.distance - character.skinWidth, 0);
      const direction = displacement.clone().normalize();

      position.x += direction.x * safeDistance;
      position.y += direction.y * safeDistance;

      this.handleHit(actor, hit);
      clipAgainstNormal(character.velocity, hit.normal);

      const remainingDistance = Math.max(distance - safeDistance, 0);

      displacement.x = direction.x * remainingDistance;
      displacement.y = direction.y * remainingDistance;

      clipAgainstNormal(displacement, hit.normal);
    }
  }

  private updateGroundState(
    actor: Actor,
    target: Point,
    canSnap: boolean,
  ): void {
    const character = actor.getComponent(CharacterBody);

    if (!canSnap) {
      this.resetGroundState(character);
      return;
    }

    const probeDistance = Math.max(
      character.groundSnapDistance,
      character.skinWidth,
    );
    const probeDirection = character.upDirection
      .clone()
      .multiplyNumber(-probeDistance);

    const hit = this.castGround(actor, target, probeDirection);

    if (!hit) {
      this.resetGroundState(character);
      return;
    }

    character.onGround = true;
    character.groundNormal = hit.normal;
    character.groundActor = hit.actor;

    const snapDistance = Math.max(hit.distance - character.skinWidth, 0);
    const snapDirection = character.upDirection
      .clone()
      .multiplyNumber(-snapDistance);

    target.x += snapDirection.x;
    target.y += snapDirection.y;
  }

  fixedUpdate(options: UpdateOptions): void {
    if (!this.world.systemApi.has(PhysicsAPI)) {
      return;
    }

    const deltaTimeInSeconds = options.deltaTime / 1000;

    this.oneWayValidator.update();

    this.actorQuery.getActors().forEach((actor) => {
      const transform = actor.getComponent(Transform);
      const character = actor.getComponent(CharacterBody);
      const rigidBody = actor.getComponent(RigidBody);
      const collider = actor.getComponent(Collider);

      this.resetState(character);

      if (
        character.disabled ||
        rigidBody.disabled ||
        collider.disabled ||
        rigidBody.type !== 'kinematic'
      ) {
        character._displacement.multiplyNumber(0);
        return;
      }

      const displacement = character.velocity
        .clone()
        .multiplyNumber(deltaTimeInSeconds)
        .add(character._displacement);

      const movingUp =
        VectorOps.dotProduct(displacement, character.upDirection) >
        SNAP_EPSILON;

      const position = new Vector2(
        transform.world.position.x,
        transform.world.position.y,
      );

      this.recoverOverlaps(actor, position);

      this.move(actor, position, displacement);

      this.updateGroundState(actor, position, !movingUp);

      rigidBody.movePosition(position);

      character._displacement.multiplyNumber(0);
    });

    this.oneWayValidator.lateUpdate();
  }
}

CharacterController.systemName = 'CharacterController';

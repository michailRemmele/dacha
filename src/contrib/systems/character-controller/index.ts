import { ActorQuery } from '../../../engine/actor';
import type { Actor } from '../../../engine/actor';
import { SceneSystem } from '../../../engine/system';
import type { SceneSystemOptions } from '../../../engine/system';
import type { Time } from '../../../engine/time';
import { Vector2, VectorOps, type Point } from '../../../engine/math-lib';
import {
  Collider,
  CharacterBody,
  RigidBody,
  Transform,
} from '../../components';
import { PhysicsAPI } from '../physics-system';
import type { CastHit, OverlapHit } from '../physics-system/types';
import { CharacterHit } from '../../events';
import { RemoveActor } from '../../../engine/events';
import type { RemoveActorEvent } from '../../../engine/events';

import { OneWayValidator } from './one-way-validator';
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
  private time: Time;

  private oneWayValidator: OneWayValidator;

  constructor(options: SceneSystemOptions) {
    super();

    this.world = options.world;
    this.time = options.time;
    this.actorQuery = new ActorQuery({
      scene: options.scene,
      filter: [CharacterBody, Transform, Collider, RigidBody],
    });
    this.actorQuery.addEventListener(RemoveActor, this.handleRemoveActor);

    this.oneWayValidator = new OneWayValidator();
  }

  onSceneDestroy(): void {
    this.actorQuery.removeEventListener(RemoveActor, this.handleRemoveActor);
    this.actorQuery.destroy();
  }

  private handleRemoveActor = (event: RemoveActorEvent): void => {
    this.oneWayValidator.delete(event.actor);
  };

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

    return this.oneWayValidator.shouldBlock(hit.actor, actor, hit.normal);
  }

  private isWalkable(actor: Actor, normal: Point): boolean {
    const character = actor.getComponent(CharacterBody);
    return (
      VectorOps.dotProduct(normal, character.upDirection) >=
      Math.cos(character.maxSlopeAngle)
    );
  }

  private isRecoverableOverlap(hit: OverlapHit): boolean {
    const rigidBody = hit.actor.getComponent(RigidBody) as
      | RigidBody
      | undefined;

    return (
      rigidBody !== undefined &&
      !rigidBody.disabled &&
      rigidBody.type !== 'dynamic'
    );
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

  private cast(
    actor: Actor,
    position: Point,
    displacement: Vector2,
    hitFilter: (hit: CastHit) => boolean,
  ): CastHit | null {
    if (displacement.squaredMagnitude <= DISTANCE_EPSILON) {
      return null;
    }

    const physicsApi = this.world.systemApi.get(PhysicsAPI);
    const character = actor.getComponent(CharacterBody);
    const transform = actor.getComponent(Transform);
    const distance = displacement.magnitude;

    this.oneWayValidator.touch(actor);

    return physicsApi.castActor({
      actor,
      offset: {
        x: position.x - transform.world.position.x,
        y: position.y - transform.world.position.y,
      },
      direction: displacement,
      maxDistance: distance + character.skinWidth,
      hitFilter: (hit) => this.isBlockingHit(actor, hit) && hitFilter(hit),
    });
  }

  private castMotion(
    actor: Actor,
    position: Point,
    displacement: Vector2,
  ): CastHit | null {
    return this.cast(actor, position, displacement, (hit) => {
      if (
        hit.distance <= DISTANCE_EPSILON &&
        VectorOps.dotProduct(displacement, hit.normal) > DISTANCE_EPSILON
      ) {
        return false;
      }

      return true;
    });
  }

  private castGround(
    actor: Actor,
    position: Point,
    displacement: Vector2,
  ): CastHit | null {
    return this.cast(actor, position, displacement, (hit) =>
      this.isWalkable(actor, hit.normal),
    );
  }

  private recoverOverlaps(actor: Actor, position: Vector2): void {
    const character = actor.getComponent(CharacterBody);
    if (!character._needsRecovery) {
      return;
    }

    const transform = actor.getComponent(Transform);
    const physicsApi = this.world.systemApi.get(PhysicsAPI);

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
        if (!this.isRecoverableOverlap(hit)) {
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
        character._needsRecovery = false;
        break;
      }
    }
  }

  private handleHit(actor: Actor, hit: CastHit): void {
    const character = actor.getComponent(CharacterBody);

    let kind: CharacterHitKind;

    if (character.motionMode === 'surface') {
      const upDot = VectorOps.dotProduct(hit.normal, character.upDirection);
      const threshold = Math.cos(character.maxSlopeAngle);

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
    if (displacement.squaredMagnitude <= DISTANCE_EPSILON) {
      return;
    }

    const character = actor.getComponent(CharacterBody);

    for (let i = 0; i < character.maxSlides; i += 1) {
      if (displacement.squaredMagnitude <= DISTANCE_EPSILON) {
        break;
      }

      const distance = displacement.magnitude;

      const hit = this.castMotion(actor, position, displacement);

      if (!hit) {
        position.add(displacement);
        break;
      }

      const safeDistance = Math.max(hit.distance - character.skinWidth, 0);
      const direction = displacement.clone().normalize();

      position.x += direction.x * safeDistance;
      position.y += direction.y * safeDistance;

      this.handleHit(actor, hit);

      const remainingDistance = Math.max(distance - safeDistance, 0);

      displacement.x = direction.x * remainingDistance;
      displacement.y = direction.y * remainingDistance;

      clipAgainstNormal(displacement, hit.normal);
    }
  }

  private updateGroundState(
    actor: Actor,
    target: Point,
    skipSnapping: boolean,
  ): void {
    const character = actor.getComponent(CharacterBody);

    if (skipSnapping) {
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

  fixedUpdate(): void {
    if (!this.world.systemApi.has(PhysicsAPI)) {
      return;
    }

    const { fixedDeltaTime } = this.time;

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

      const position = new Vector2(
        transform.world.position.x,
        transform.world.position.y,
      );

      this.recoverOverlaps(actor, position);

      const displacement = character.velocity
        .clone()
        .multiplyNumber(fixedDeltaTime)
        .add(character._displacement);

      const movingUp =
        VectorOps.dotProduct(displacement, character.upDirection) >
        SNAP_EPSILON;

      this.move(actor, position, displacement);

      this.updateGroundState(
        actor,
        position,
        movingUp || character.motionMode === 'free',
      );

      if (
        Math.abs(position.x - transform.world.position.x) > DISTANCE_EPSILON ||
        Math.abs(position.y - transform.world.position.y) > DISTANCE_EPSILON
      ) {
        rigidBody.movePosition(position);
      }

      character._displacement.multiplyNumber(0);
    });

    this.oneWayValidator.lateUpdate();
  }
}

CharacterController.systemName = 'CharacterController';

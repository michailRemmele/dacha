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
import type { CastHit } from '../physics-system/types';

import { clipAgainstNormal } from './utils';

const MIN_DISTANCE = 0.000001;

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

  constructor(options: SceneSystemOptions) {
    super();

    this.world = options.world;
    this.actorQuery = new ActorQuery({
      scene: options.scene,
      filter: [CharacterBody, Transform, Collider, RigidBody],
    });
  }

  onSceneDestroy(): void {
    this.actorQuery.destroy();
  }

  private isWalkable(normal: Point, controller: CharacterBody): boolean {
    return (
      VectorOps.dotProduct(normal, controller.upDirection) >=
      Math.cos(controller.maxSlopeAngle)
    );
  }

  private isBlockingHit(hit: CastHit, direction: Vector2): boolean {
    const rigidBody = hit.actor.getComponent(RigidBody) as
      | RigidBody
      | undefined;

    if (!rigidBody || rigidBody.disabled) {
      return false;
    }

    if (!rigidBody?.oneWay || !rigidBody.oneWayNormal) {
      return true;
    }

    const transform = hit.actor.getComponent(Transform);
    const oneWayNormal = VectorOps.rotatePoint(
      rigidBody.oneWayNormal,
      transform.world.rotation,
    );

    return (
      VectorOps.dotProduct(oneWayNormal, hit.normal) > 0 &&
      VectorOps.dotProduct(direction, hit.normal) < 0
    );
  }

  private cast(
    actor: Actor,
    position: Point,
    displacement: Vector2,
  ): CastHit | null {
    const physicsApi = this.world.systemApi.get(PhysicsAPI);

    const controller = actor.getComponent(CharacterBody);
    const transform = actor.getComponent(Transform);

    const distance = displacement.magnitude;

    if (distance <= MIN_DISTANCE) {
      return null;
    }

    const hits = physicsApi.castActorAll({
      actor,
      offset: {
        x: position.x - transform.world.position.x,
        y: position.y - transform.world.position.y,
      },
      direction: displacement,
      maxDistance: distance + controller.skinWidth,
    });

    for (const hit of hits) {
      if (this.isBlockingHit(hit, displacement)) {
        return hit;
      }
    }

    return null;
  }

  private handleHit(controller: CharacterBody, hit: CastHit): void {
    const upDot = VectorOps.dotProduct(hit.normal, controller.upDirection);
    const threshold = Math.cos(controller.maxSlopeAngle);

    if (upDot >= threshold) {
      controller.onGround = true;
      controller.groundNormal = hit.normal;
      controller.groundActor = hit.actor;
      return;
    }

    if (upDot <= -threshold) {
      controller.onCeiling = true;
      return;
    }

    controller.onWall = true;
  }

  private move(actor: Actor, displacement: Vector2): Point {
    const controller = actor.getComponent(CharacterBody);
    const transform = actor.getComponent(Transform);

    const position = new Vector2(
      transform.world.position.x,
      transform.world.position.y,
    );

    for (let iteration = 0; iteration < controller.maxSlides; iteration += 1) {
      const distance = displacement.magnitude;

      if (distance <= MIN_DISTANCE) {
        break;
      }

      const hit = this.cast(actor, position, displacement);

      if (!hit) {
        position.add(displacement);
        break;
      }

      const safeDistance = Math.max(hit.distance - controller.skinWidth, 0);
      const direction = displacement.clone().normalize();

      position.x += direction.x * safeDistance;
      position.y += direction.y * safeDistance;

      this.handleHit(controller, hit);
      clipAgainstNormal(controller.velocity, hit.normal);

      const remainingDistance = Math.max(distance - safeDistance, 0);

      displacement.x = direction.x * remainingDistance;
      displacement.y = direction.y * remainingDistance;

      clipAgainstNormal(displacement, hit.normal);
    }

    return position;
  }

  private updateGroundState(actor: Actor, position: Point): void {
    const controller = actor.getComponent(CharacterBody);

    const probeDistance = Math.max(
      controller.groundProbeDistance,
      controller.skinWidth,
    );
    const hit = this.cast(
      actor,
      position,
      controller.upDirection.clone().multiplyNumber(-probeDistance),
    );

    if (hit && this.isWalkable(hit.normal, controller)) {
      controller.onGround = true;
      controller.groundNormal = hit.normal;
      controller.groundActor = hit.actor;
      return;
    }

    controller.onGround = false;
    controller.groundActor = null;
  }

  private resetState(controller: CharacterBody): void {
    if (controller.onGround) {
      controller.groundActor = null;
      controller.groundNormal = controller.upDirection.clone();
      controller.onGround = false;
    }
    controller.onWall = false;
    controller.onCeiling = false;
  }

  fixedUpdate(options: UpdateOptions): void {
    if (!this.world.systemApi.has(PhysicsAPI)) {
      return;
    }

    const deltaTimeInSeconds = options.deltaTime / 1000;

    this.actorQuery.getActors().forEach((actor) => {
      const controller = actor.getComponent(CharacterBody);
      const rigidBody = actor.getComponent(RigidBody);
      const collider = actor.getComponent(Collider);

      this.resetState(controller);

      if (
        controller.disabled ||
        rigidBody.disabled ||
        collider.disabled ||
        rigidBody.type !== 'kinematic'
      ) {
        controller._displacement.multiplyNumber(0);
        return;
      }

      const displacement = controller.velocity
        .clone()
        .multiplyNumber(deltaTimeInSeconds)
        .add(controller._displacement);

      const target = this.move(actor, displacement);

      this.updateGroundState(actor, target);

      rigidBody.movePosition(new Vector2(target.x, target.y));

      controller._displacement.multiplyNumber(0);
    });
  }
}

CharacterController.systemName = 'CharacterController';

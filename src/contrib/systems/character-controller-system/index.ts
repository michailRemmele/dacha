import { ActorQuery } from '../../../engine/actor';
import type { Actor } from '../../../engine/actor';
import { SceneSystem } from '../../../engine/system';
import type { SceneSystemOptions, UpdateOptions } from '../../../engine/system';
import { Vector2, VectorOps, type Point } from '../../../engine/math-lib';
import {
  Collider,
  CharacterController,
  RigidBody,
  Transform,
} from '../../components';
import { PhysicsAPI } from '../physics-system';
import type { CastHit, ShapeCastParams } from '../physics-system/types';

import { clipAgainstNormal } from './utils';

const MIN_DISTANCE = 0.000001;

/**
 * Kinematic character controller system with sweep/slide collision movement.
 *
 * The system expects actors to have `CharacterController`, `Transform`,
 * `Collider`, and a kinematic `RigidBody`. Put this system before
 * `PhysicsSystem` in system configuration so `movePosition()` targets are
 * consumed by physics in the same fixed step.
 *
 * @category Systems
 */
export class CharacterControllerSystem extends SceneSystem {
  private actorQuery: ActorQuery;
  private world: SceneSystemOptions['world'];

  constructor(options: SceneSystemOptions) {
    super();

    this.world = options.world;
    this.actorQuery = new ActorQuery({
      scene: options.scene,
      filter: [CharacterController, Transform, Collider, RigidBody],
    });
  }

  onSceneDestroy(): void {
    this.actorQuery.destroy();
  }

  private getCastShape(
    transform: Transform,
    collider: Collider,
    position: Point,
  ): ShapeCastParams['shape'] | null {
    const center = {
      x: position.x + collider.offset.x,
      y: position.y + collider.offset.y,
    };
    const { scale } = transform.world;

    switch (collider.shape.type) {
      case 'circle':
        return {
          type: 'circle',
          center,
          radius: collider.shape.radius * Math.max(scale.x, scale.y),
        };
      case 'box':
        return {
          type: 'box',
          center,
          size: {
            x: collider.shape.size.x * scale.x,
            y: collider.shape.size.y * scale.y,
          },
        };
      case 'capsule':
        return {
          type: 'capsule',
          center,
          height: collider.shape.height * scale.y,
          radius: collider.shape.radius * Math.max(scale.x, scale.y),
        };
      case 'segment':
        return null;
    }
  }

  private isWalkable(normal: Point, controller: CharacterController): boolean {
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

    const controller = actor.getComponent(CharacterController);
    const collider = actor.getComponent(Collider);
    const transform = actor.getComponent(Transform);

    const distance = displacement.magnitude;

    if (distance <= MIN_DISTANCE) {
      return null;
    }

    const shape = this.getCastShape(transform, collider, position);

    if (!shape) {
      return null;
    }

    const hits = physicsApi.shapeCastAll({
      shape,
      direction: displacement,
      maxDistance: distance + controller.safeMargin,
      layer: controller.layer ?? collider.layer,
      excludeActors: [actor],
    } as ShapeCastParams);

    for (const hit of hits) {
      if (this.isBlockingHit(hit, displacement)) {
        return hit;
      }
    }

    return null;
  }

  private handleHit(controller: CharacterController, hit: CastHit): void {
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
    const controller = actor.getComponent(CharacterController);
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

      const safeDistance = Math.max(hit.distance - controller.safeMargin, 0);
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
    const controller = actor.getComponent(CharacterController);

    const probeDistance = Math.max(
      controller.groundSnapDistance,
      controller.safeMargin,
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

  private resetState(controller: CharacterController): void {
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
      const controller = actor.getComponent(CharacterController);
      const rigidBody = actor.getComponent(RigidBody);
      const collider = actor.getComponent(Collider);

      this.resetState(controller);

      if (
        controller.disabled ||
        rigidBody.disabled ||
        collider.disabled ||
        rigidBody.type !== 'kinematic'
      ) {
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

CharacterControllerSystem.systemName = 'CharacterControllerSystem';

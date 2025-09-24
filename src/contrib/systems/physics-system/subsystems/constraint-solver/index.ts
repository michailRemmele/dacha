import { Vector2 } from '../../../../../engine/math-lib';
import type { SceneSystemOptions } from '../../../../../engine/system';
import type { Actor } from '../../../../../engine/actor';
import type { Scene } from '../../../../../engine/scene';
import { RigidBody } from '../../../../components/rigid-body';
import type { RigidBodyType } from '../../../../components/rigid-body';
import { Transform } from '../../../../components/transform';
import { Collision } from '../../../../events';
import type { CollisionEvent } from '../../../../events';
import { RIGID_BODY_TYPE } from '../../consts';

export class ConstraintSolver {
  private scene: Scene;
  private processedPairs: Map<Actor, Set<Actor>>;
  private mtvMap: Map<Actor, Record<string, Vector2>>;

  constructor(options: SceneSystemOptions) {
    this.scene = options.scene;
    this.processedPairs = new Map();
    this.mtvMap = new Map();

    this.scene.addEventListener(Collision, this.handleCollision);
  }

  destroy(): void {
    this.scene.removeEventListener(Collision, this.handleCollision);
  }

  private handleCollision = (event: CollisionEvent): void => {
    const { actor1, actor2, mtv1, mtv2 } = event;

    if (
      this.processedPairs.has(actor2) &&
      this.processedPairs.get(actor2)!.has(actor1)
    ) {
      return;
    }

    if (!this.processedPairs.has(actor1)) {
      this.processedPairs.set(actor1, new Set());
    }

    this.processedPairs.get(actor1)!.add(actor2);

    if (!this.validateCollision(actor1, actor2)) {
      return;
    }

    this.resolveCollision(actor1, actor2, mtv1, mtv2);
  };

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

    if (
      rigidBody1.type === RIGID_BODY_TYPE.STATIC ||
      rigidBody2.type === RIGID_BODY_TYPE.STATIC
    ) {
      return !rigidBody1.ghost && !rigidBody2.ghost;
    }

    return (
      !rigidBody1.ghost &&
      !rigidBody1.isPermeable &&
      !rigidBody2.ghost &&
      !rigidBody2.isPermeable
    );
  }

  private setMtv(
    actor: Actor,
    mtvX: number,
    mtvY: number,
    type: RigidBodyType,
  ): void {
    if (!this.mtvMap.has(actor)) {
      this.mtvMap.set(actor, {});
    }

    const mtvs = this.mtvMap.get(actor)!;

    if (!mtvs?.[type]) {
      mtvs[type] = new Vector2(mtvX, mtvY);
      return;
    }

    switch (type) {
      case 'static':
        mtvs[type].x =
          Math.abs(mtvX) > Math.abs(mtvs[type].x) ? mtvX : mtvs[type].x;
        mtvs[type].y =
          Math.abs(mtvY) > Math.abs(mtvs[type].y) ? mtvY : mtvs[type].y;
        break;
      case 'dynamic':
        mtvs[type].x += mtvX;
        mtvs[type].y += mtvY;
    }
  }

  private resolveCollision(
    actor1: Actor,
    actor2: Actor,
    mtv1: Vector2,
    mtv2: Vector2,
  ): void {
    const rigidBody1 = actor1.getComponent(RigidBody);
    const rigidBody2 = actor2.getComponent(RigidBody);

    if (rigidBody1.type === RIGID_BODY_TYPE.STATIC) {
      this.setMtv(actor2, mtv2.x, mtv2.y, rigidBody1.type);
    } else if (rigidBody2.type === RIGID_BODY_TYPE.STATIC) {
      this.setMtv(actor1, mtv1.x, mtv1.y, rigidBody2.type);
    } else {
      this.setMtv(actor1, mtv1.x / 2, mtv1.y / 2, rigidBody2.type);
      this.setMtv(actor2, mtv2.x / 2, mtv2.y / 2, rigidBody1.type);
    }
  }

  update(): void {
    for (const [actor, entry] of this.mtvMap) {
      const transform = actor.getComponent(Transform);

      const { static: staticMtv, dynamic: dynamicMtv } = entry;

      /*
       * TODO:: Enable this part when it will be possible to run
       * phycics pipeline several times per single game loop iteration
       */
      // transform.offsetX += Math.sign(staticMtv.x) === Math.sign(dynamicMtv.x)
      //   ? staticMtv.x + dynamicMtv.x
      //   : staticMtv.x || dynamicMtv.x;
      // transform.offsetY += Math.sign(staticMtv.y) === Math.sign(dynamicMtv.y)
      //   ? staticMtv.y + dynamicMtv.y
      //   : staticMtv.y || dynamicMtv.y;

      transform.offsetX += (staticMtv?.x ?? 0) + (dynamicMtv?.x ?? 0);
      transform.offsetY += (staticMtv?.y ?? 0) + (dynamicMtv?.y ?? 0);
    }

    this.processedPairs.clear();
    this.mtvMap.clear();
  }
}

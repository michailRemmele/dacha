import { Vector2 } from '../../../../../engine/math-lib';
import { ActorCollection } from '../../../../../engine/actor';
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
  private actorCollection: ActorCollection;
  private scene: Scene;
  private processedPairs: Record<string, Record<string, boolean>>;
  private mtvMap: Record<string, Record<string, Vector2>>;

  constructor(options: SceneSystemOptions) {
    this.actorCollection = new ActorCollection(options.scene, {
      components: [
        RigidBody,
        Transform,
      ],
    });
    this.scene = options.scene;
    this.processedPairs = {};
    this.mtvMap = {};

    this.scene.addEventListener(Collision, this.handleCollision);
  }

  destroy(): void {
    this.scene.removeEventListener(Collision, this.handleCollision);
  }

  private handleCollision = (event: CollisionEvent): void => {
    const {
      actor1, actor2, mtv1, mtv2,
    } = event;

    const id1 = actor1.id;
    const id2 = actor2.id;

    if (this.processedPairs[id2] && this.processedPairs[id2][id1]) {
      return;
    }

    this.processedPairs[id1] ??= {};
    this.processedPairs[id1][id2] = true;

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

    if (rigidBody1.type === RIGID_BODY_TYPE.STATIC && rigidBody2.type === RIGID_BODY_TYPE.STATIC) {
      return false;
    }

    if (rigidBody1.type === RIGID_BODY_TYPE.STATIC || rigidBody2.type === RIGID_BODY_TYPE.STATIC) {
      return !rigidBody1.ghost && !rigidBody2.ghost;
    }

    return !rigidBody1.ghost && !rigidBody1.isPermeable
      && !rigidBody2.ghost && !rigidBody2.isPermeable;
  }

  private setMtv(id: string, mtvX: number, mtvY: number, type: RigidBodyType): void {
    this.mtvMap[id] = this.mtvMap[id] || {};

    if (!this.mtvMap[id][type]) {
      this.mtvMap[id][type] = new Vector2(mtvX, mtvY);
      return;
    }

    const settingStrategy = {
      static: (): void => {
        this.mtvMap[id][type].x = Math.abs(mtvX) > Math.abs(this.mtvMap[id][type].x)
          ? mtvX
          : this.mtvMap[id][type].x;
        this.mtvMap[id][type].y = Math.abs(mtvY) > Math.abs(this.mtvMap[id][type].y)
          ? mtvY
          : this.mtvMap[id][type].y;
      },
      dynamic: (): void => {
        this.mtvMap[id][type].x += mtvX;
        this.mtvMap[id][type].y += mtvY;
      },
    };

    settingStrategy[type]();
  }

  private resolveCollision(
    actor1: Actor,
    actor2: Actor,
    mtv1: Vector2,
    mtv2: Vector2,
  ): void {
    const id1 = actor1.id;
    const id2 = actor2.id;

    const rigidBody1 = actor1.getComponent(RigidBody);
    const rigidBody2 = actor2.getComponent(RigidBody);

    if (rigidBody1.type === RIGID_BODY_TYPE.STATIC) {
      this.setMtv(id2, mtv2.x, mtv2.y, rigidBody1.type);
    } else if (rigidBody2.type === RIGID_BODY_TYPE.STATIC) {
      this.setMtv(id1, mtv1.x, mtv1.y, rigidBody2.type);
    } else {
      this.setMtv(id1, mtv1.x / 2, mtv1.y / 2, rigidBody2.type);
      this.setMtv(id2, mtv2.x / 2, mtv2.y / 2, rigidBody1.type);
    }
  }

  update(): void {
    Object.keys(this.mtvMap).forEach((id) => {
      const actor = this.actorCollection.getById(id) as Actor;
      const transform = actor.getComponent(Transform);

      const mtvs = Object.keys(this.mtvMap[id]);

      if (mtvs.length === 1) {
        transform.offsetX += this.mtvMap[id][mtvs[0]].x;
        transform.offsetY += this.mtvMap[id][mtvs[0]].y;
        return;
      }

      const { static: staticMtv, dynamic: dynamicMtv } = this.mtvMap[id];

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

      transform.offsetX += staticMtv.x + dynamicMtv.x;
      transform.offsetY += staticMtv.y + dynamicMtv.y;
    });

    this.processedPairs = {};
    this.mtvMap = {};
  }
}

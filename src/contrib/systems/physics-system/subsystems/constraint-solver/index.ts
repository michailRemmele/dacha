import {
  COLLISION_ENTER_MSG,
  COLLISION_STAY_MSG,
  RIGID_BODY_COMPONENT_NAME,
  TRANSFORM_COMPONENT_NAME,
} from '../../consts';
import { Vector2 } from '../../../../../engine/mathLib';
import type { System, SystemOptions } from '../../../../../engine/system';
import type { GameObject, GameObjectObserver } from '../../../../../engine/game-object';
import type { MessageBus, Message } from '../../../../../engine/message-bus';
import type { RigidBody, RigidBodyType } from '../../../../components/rigid-body';
import type { Transform } from '../../../../components/transform';

const RIGID_BODY_TYPE = {
  STATIC: 'static',
  DYNAMIC: 'dynamic',
};

interface Mtv {
  x: number
  y: number
}

interface CollisionEventMessage extends Message {
  gameObject1: GameObject
  gameObject2: GameObject
  mtv1: Mtv
  mtv2: Mtv
}

export class ConstraintSolver implements System {
  private gameObjectObserver: GameObjectObserver;
  private messageBus: MessageBus;
  private processedPairs: Record<string, Record<string, boolean>>;
  private mtvMap: Record<string, Record<string, Mtv>>;

  constructor(options: SystemOptions) {
    this.gameObjectObserver = options.createGameObjectObserver({
      components: [
        RIGID_BODY_COMPONENT_NAME,
        TRANSFORM_COMPONENT_NAME,
      ],
    });
    this.messageBus = options.messageBus;
    this.processedPairs = {};
    this.mtvMap = {};
  }

  private validateCollision(gameObject1: GameObject, gameObject2: GameObject): boolean {
    const rigidBody1 = gameObject1.getComponent(RIGID_BODY_COMPONENT_NAME) as RigidBody;
    const rigidBody2 = gameObject2.getComponent(RIGID_BODY_COMPONENT_NAME) as RigidBody;

    return rigidBody1 && !rigidBody1.ghost && !rigidBody1.isPermeable
      && rigidBody2 && !rigidBody2.ghost && !rigidBody2.isPermeable
      && (rigidBody1.type !== RIGID_BODY_TYPE.STATIC || rigidBody2.type !== RIGID_BODY_TYPE.STATIC);
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
    gameObject1: GameObject,
    gameObject2: GameObject,
    mtv1: Mtv,
    mtv2: Mtv,
  ): void {
    const id1 = gameObject1.getId();
    const id2 = gameObject2.getId();

    const rigidBody1 = gameObject1.getComponent(RIGID_BODY_COMPONENT_NAME) as RigidBody;
    const rigidBody2 = gameObject2.getComponent(RIGID_BODY_COMPONENT_NAME) as RigidBody;

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
    this.processedPairs = {};
    this.mtvMap = {};

    const enterMessages = this.messageBus.get(COLLISION_ENTER_MSG) || [];
    const stayMessages = this.messageBus.get(COLLISION_STAY_MSG) || [];
    [enterMessages, stayMessages].forEach((messages) => {
      messages.forEach((message) => {
        const {
          gameObject1, gameObject2, mtv1, mtv2,
        } = message as CollisionEventMessage;

        const id1 = gameObject1.getId();
        const id2 = gameObject2.getId();

        if (this.processedPairs[id2] && this.processedPairs[id2][id1]) {
          return;
        }

        this.processedPairs[id1] = this.processedPairs[id1] || {};
        this.processedPairs[id1][id2] = true;

        if (!this.validateCollision(gameObject1, gameObject2)) {
          return;
        }

        this.resolveCollision(gameObject1, gameObject2, mtv1, mtv2);
      });
    });

    Object.keys(this.mtvMap).forEach((id) => {
      const gameObject = this.gameObjectObserver.getById(id) as GameObject;
      const transform = gameObject.getComponent(TRANSFORM_COMPONENT_NAME) as Transform;

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
  }
}

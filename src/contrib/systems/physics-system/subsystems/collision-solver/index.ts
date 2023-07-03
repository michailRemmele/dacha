import {
  ADD_FORCE_MSG,
  STOP_MOVEMENT_MSG,
  COLLISION_ENTER_MSG,
  COLLISION_STAY_MSG,
  RIGID_BODY_COMPONENT_NAME,
  GRAVITATIONAL_ACCELERATION_STORE_KEY,
} from '../../consts';
import { Vector2 } from '../../../../../engine/mathLib';
import type { System, SystemOptions } from '../../../../../engine/system';
import type { GameObject } from '../../../../../engine/game-object';
import type { MessageBus, Message } from '../../../../../engine/message-bus';
import type { Store } from '../../../../../engine/scene';
import type { RigidBody } from '../../../../components/rigid-body';

const REACTION_FORCE_VECTOR_X = 0;
const REACTION_FORCE_VECTOR_Y = -1;

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

export class CollisionSolver implements System {
  private messageBus: MessageBus;
  private store: Store;
  private gravitationalAcceleration: number;

  constructor(options: SystemOptions) {
    const { store, messageBus } = options;

    this.store = store;
    this.messageBus = messageBus;

    this.gravitationalAcceleration = this.store.get(GRAVITATIONAL_ACCELERATION_STORE_KEY) as number;
  }

  private addReactionForce(gameObject: GameObject, mtv: Mtv): void {
    const rigidBody = gameObject.getComponent(RIGID_BODY_COMPONENT_NAME) as RigidBody;
    const { useGravity, mass } = rigidBody;

    if (useGravity && mtv.y && Math.sign(mtv.y) === -1 && !mtv.x) {
      const reactionForce = new Vector2(REACTION_FORCE_VECTOR_X, REACTION_FORCE_VECTOR_Y);
      reactionForce.multiplyNumber(mass * this.gravitationalAcceleration);

      this.messageBus.send({
        type: ADD_FORCE_MSG,
        value: reactionForce,
        gameObject,
        id: gameObject.getId(),
      }, true);

      this.messageBus.send({
        type: STOP_MOVEMENT_MSG,
        gameObject,
        id: gameObject.getId(),
      }, true);
    }
  }

  private validateCollision(gameObject1: GameObject, gameObject2: GameObject): boolean {
    const rigidBody1 = gameObject1.getComponent(RIGID_BODY_COMPONENT_NAME) as RigidBody;
    const rigidBody2 = gameObject2.getComponent(RIGID_BODY_COMPONENT_NAME) as RigidBody;

    return rigidBody1 && !rigidBody1.ghost && rigidBody2 && !rigidBody2.ghost;
  }

  update(): void {
    const enterMessages = this.messageBus.get(COLLISION_ENTER_MSG) || [];
    const stayMessages = this.messageBus.get(COLLISION_STAY_MSG) || [];
    [enterMessages, stayMessages].forEach((messages) => {
      messages.forEach((message) => {
        const { gameObject1, gameObject2, mtv1 } = message as CollisionEventMessage;

        if (!this.validateCollision(gameObject1, gameObject2)) {
          return;
        }

        this.addReactionForce(gameObject1, mtv1);
      });
    });
  }
}

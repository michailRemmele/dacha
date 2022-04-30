import type { System, SystemOptions } from '../../../engine/system';
import type { Entity } from '../../../engine/entity';
import type { MessageBus, Message } from '../../../engine/message-bus';
import type { Store } from '../../../engine/scene';
import type { RigidBody } from '../../components/rigid-body';
import { Vector2 } from '../../../engine/mathLib';

const ADD_FORCE_MSG = 'ADD_FORCE';
const STOP_MOVEMENT_MSG = 'STOP_MOVEMENT';
const COLLISION_ENTER_MSG = 'COLLISION_ENTER';
const COLLISION_STAY_MSG = 'COLLISION_STAY';

const RIGID_BODY_COMPONENT_NAME = 'rigidBody';

const GRAVITATIONAL_ACCELERATION_STORE_KEY = 'gravitationalAcceleration';

const REACTION_FORCE_VECTOR_X = 0;
const REACTION_FORCE_VECTOR_Y = -1;

interface Mtv {
  x: number
  y: number
}

interface CollisionEventMessage extends Message {
  entity1: Entity
  entity2: Entity
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

  private addReactionForce(entity: Entity, mtv: Mtv): void {
    const rigidBody = entity.getComponent(RIGID_BODY_COMPONENT_NAME) as RigidBody;
    const { useGravity, mass } = rigidBody;

    if (useGravity && mtv.y && Math.sign(mtv.y) === -1 && !mtv.x) {
      const reactionForce = new Vector2(REACTION_FORCE_VECTOR_X, REACTION_FORCE_VECTOR_Y);
      reactionForce.multiplyNumber(mass * this.gravitationalAcceleration);

      this.messageBus.send({
        type: ADD_FORCE_MSG,
        value: reactionForce,
        entity,
        id: entity.getId(),
      }, true);

      this.messageBus.send({
        type: STOP_MOVEMENT_MSG,
        entity,
        id: entity.getId(),
      }, true);
    }
  }

  private validateCollision(entity1: Entity, entity2: Entity): boolean {
    const rigidBody1 = entity1.getComponent(RIGID_BODY_COMPONENT_NAME) as RigidBody;
    const rigidBody2 = entity2.getComponent(RIGID_BODY_COMPONENT_NAME) as RigidBody;

    return rigidBody1 && !rigidBody1.ghost && rigidBody2 && !rigidBody2.ghost;
  }

  update(): void {
    const enterMessages = this.messageBus.get(COLLISION_ENTER_MSG) || [];
    const stayMessages = this.messageBus.get(COLLISION_STAY_MSG) || [];
    [enterMessages, stayMessages].forEach((messages) => {
      messages.forEach((message) => {
        const { entity1, entity2, mtv1 } = message as CollisionEventMessage;

        if (!this.validateCollision(entity1, entity2)) {
          return;
        }

        this.addReactionForce(entity1, mtv1);
      });
    });
  }
}

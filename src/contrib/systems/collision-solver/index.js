import { Vector2 } from '../../../engine/mathLib';

const ADD_FORCE_MSG = 'ADD_FORCE';
const STOP_MOVEMENT_MSG = 'STOP_MOVEMENT';
const COLLISION_ENTER_MSG = 'COLLISION_ENTER';
const COLLISION_STAY_MSG = 'COLLISION_STAY';

const RIGID_BODY_COMPONENT_NAME = 'rigidBody';

const GRAVITATIONAL_ACCELERATION_STORE_KEY = 'gravitationalAcceleration';

const REACTION_FORCE_VECTOR_X = 0;
const REACTION_FORCE_VECTOR_Y = -1;

export class CollisionSolver {
  constructor(options) {
    const { entityObserver, store, messageBus } = options;

    this._store = store;
    this._entityObserver = entityObserver;
    this.messageBus = messageBus;
  }

  systemDidMount() {
    this._gravitationalAcceleration = this._store.get(GRAVITATIONAL_ACCELERATION_STORE_KEY);
  }

  _addReactionForce(entity, mtv) {
    const rigidBody = entity.getComponent(RIGID_BODY_COMPONENT_NAME);
    const { useGravity, mass } = rigidBody;

    if (useGravity && mtv.y && Math.sign(mtv.y) === -1 && !mtv.x) {
      const reactionForce = new Vector2(REACTION_FORCE_VECTOR_X, REACTION_FORCE_VECTOR_Y);
      reactionForce.multiplyNumber(mass * this._gravitationalAcceleration);

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

  _validateCollision(entity1, entity2) {
    const rigidBody1 = entity1.getComponent(RIGID_BODY_COMPONENT_NAME);
    const rigidBody2 = entity2.getComponent(RIGID_BODY_COMPONENT_NAME);

    return rigidBody1 && !rigidBody1.ghost && rigidBody2 && !rigidBody2.ghost;
  }

  update() {
    const enterMessages = this.messageBus.get(COLLISION_ENTER_MSG) || [];
    const stayMessages = this.messageBus.get(COLLISION_STAY_MSG) || [];
    [enterMessages, stayMessages].forEach((messages) => {
      messages.forEach((message) => {
        const { entity1, entity2, mtv1 } = message;

        if (!this._validateCollision(entity1, entity2)) {
          return;
        }

        this._addReactionForce(entity1, mtv1);
      });
    });
  }
}

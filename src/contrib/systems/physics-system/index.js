import { Vector2 } from '../../../engine/mathLib';

const ADD_FORCE_MSG = 'ADD_FORCE';
const ADD_IMPULSE_MSG = 'ADD_IMPULSE';
const STOP_MOVEMENT_MSG = 'STOP_MOVEMENT';

const RIGID_BODY_COMPONENT_NAME = 'rigidBody';
const TRANSFORM_COMPONENT_NAME = 'transform';

const GRAVITATIONAL_ACCELERATION_STORE_KEY = 'gravitationalAcceleration';

const DIRECTION_VECTOR = {
  UP: new Vector2(0, -1),
  LEFT: new Vector2(-1, 0),
  RIGHT: new Vector2(1, 0),
  DOWN: new Vector2(0, 1),
};

export class PhysicsSystem {
  constructor(options) {
    const {
      gravitationalAcceleration, entityObserver, store, messageBus,
    } = options;

    this._gravitationalAcceleration = gravitationalAcceleration;
    this._entityObserver = entityObserver;
    this._store = store;
    this.messageBus = messageBus;

    this._entitiesVelocity = {};
  }

  systemDidMount() {
    this._store.set(GRAVITATIONAL_ACCELERATION_STORE_KEY, this._gravitationalAcceleration);
    this._entityObserver.subscribe('onremove', this._handleEntityRemove);
  }

  systemWillUnmount() {
    this._entityObserver.unsubscribe('onremove', this._handleEntityRemove);
  }

  _handleEntityRemove = (entity) => {
    this._entitiesVelocity[entity.getId()] = null;
  };

  _applyDragForce(entity, deltaTime) {
    const { mass, drag } = entity.getComponent(RIGID_BODY_COMPONENT_NAME);
    const entityId = entity.getId();
    const velocity = this._entitiesVelocity[entityId];

    if (!drag || !velocity || (!velocity.x && !velocity.y)) {
      return;
    }

    const velocitySignX = Math.sign(velocity.x);
    const velocitySignY = Math.sign(velocity.y);

    const reactionForceValue = mass * this._gravitationalAcceleration;
    const dragForceValue = -1 * drag * reactionForceValue;
    const forceToVelocityMultiplier = deltaTime / mass;
    const slowdownValue = dragForceValue * forceToVelocityMultiplier;
    const normalizationMultiplier = 1 / velocity.magnitude;

    const slowdown = velocity.clone();
    slowdown.multiplyNumber(slowdownValue * normalizationMultiplier);

    velocity.add(slowdown);

    if (Math.sign(velocity.x) !== velocitySignX && Math.sign(velocity.y) !== velocitySignY) {
      velocity.multiplyNumber(0);
    }
  }

  _getGravityForce(rigidBody) {
    const { mass, useGravity } = rigidBody;

    const gravityVector = new Vector2(0, 0);

    if (useGravity) {
      gravityVector.add(DIRECTION_VECTOR.DOWN);
      gravityVector.multiplyNumber(mass * this._gravitationalAcceleration);
    }

    return gravityVector;
  }

  _getForceVector(entity) {
    const entityId = entity.getId();
    const rigidBody = entity.getComponent(RIGID_BODY_COMPONENT_NAME);

    const forceVector = new Vector2(0, 0);

    forceVector.add(this._getGravityForce(rigidBody));

    const addForceMessages = this.messageBus.getById(ADD_FORCE_MSG, entityId) || [];
    addForceMessages.forEach((message) => forceVector.add(message.value));

    return forceVector;
  }

  _getImpulseVector(entity) {
    const entityId = entity.getId();
    const addImpulseMessages = this.messageBus.getById(ADD_IMPULSE_MSG, entityId) || [];

    return addImpulseMessages.reduce((vector, message) => {
      vector.add(message.value);

      return vector;
    }, new Vector2(0, 0));
  }

  _processConstraints() {
    const stopMovementMessages = this.messageBus.get(STOP_MOVEMENT_MSG) || [];

    stopMovementMessages.forEach((message) => {
      const { entity } = message;
      const entityId = entity.getId();

      if (this._entitiesVelocity[entityId]) {
        this._entitiesVelocity[entityId].multiplyNumber(0);
      }
    });
  }

  update(options) {
    const { deltaTime } = options;
    const deltaTimeInMsec = deltaTime;
    const deltaTimeInSeconds = deltaTimeInMsec / 1000;

    this._entityObserver.fireEvents();

    this._processConstraints();

    this._entityObserver.forEach((entity) => {
      const entityId = entity.getId();
      const rigidBody = entity.getComponent(RIGID_BODY_COMPONENT_NAME);
      const transform = entity.getComponent(TRANSFORM_COMPONENT_NAME);
      const { mass } = rigidBody;

      const forceVector = this._getForceVector(entity);
      const impulseVector = this._getImpulseVector(entity);

      this._entitiesVelocity[entityId] = this._entitiesVelocity[entityId]
        || new Vector2(0, 0);

      const velocityVector = this._entitiesVelocity[entityId];

      if (forceVector.x || forceVector.y) {
        forceVector.multiplyNumber(deltaTimeInSeconds / mass);
        velocityVector.add(forceVector);
      }

      if (impulseVector.x || impulseVector.y) {
        impulseVector.multiplyNumber(1 / mass);
        velocityVector.add(impulseVector);
      }

      this._applyDragForce(entity, deltaTimeInSeconds);

      transform.offsetX += velocityVector.x * deltaTimeInSeconds;
      transform.offsetY += velocityVector.y * deltaTimeInSeconds;
    });
  }
}

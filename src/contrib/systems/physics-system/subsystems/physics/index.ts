import {
  ADD_FORCE_MSG,
  ADD_IMPULSE_MSG,
  STOP_MOVEMENT_MSG,
  RIGID_BODY_COMPONENT_NAME,
  TRANSFORM_COMPONENT_NAME,
  GRAVITATIONAL_ACCELERATION_STORE_KEY,
} from '../../consts';
import { Vector2 } from '../../../../../engine/mathLib';
import { filterByKey } from '../../../../../engine/utils';
import type { System, SystemOptions, UpdateOptions } from '../../../../../engine/system';
import type { GameObject, GameObjectObserver } from '../../../../../engine/game-object';
import type { MessageBus, Message } from '../../../../../engine/message-bus';
import type { Store } from '../../../../../engine/scene';
import type { RigidBody } from '../../../../components/rigid-body';
import type { Transform } from '../../../../components/transform';

const DIRECTION_VECTOR = {
  UP: new Vector2(0, -1),
  LEFT: new Vector2(-1, 0),
  RIGHT: new Vector2(1, 0),
  DOWN: new Vector2(0, 1),
};

interface AddForceMessage extends Message {
  value: Vector2
}

interface AddImpulseMessage extends Message {
  value: Vector2
}

interface StopMovementMessage extends Message {
  gameObject: GameObject
}

interface PhysicsSystemOptions extends SystemOptions {
  gravitationalAcceleration: number;
}

export class PhysicsSubsystem implements System {
  private gameObjectObserver: GameObjectObserver;
  private store: Store;
  private messageBus: MessageBus;
  private gravitationalAcceleration: number;
  private gameObjectsVelocity: Record<string, Vector2>;

  constructor(options: SystemOptions) {
    const {
      gravitationalAcceleration, createGameObjectObserver, store, messageBus,
    } = options as PhysicsSystemOptions;

    this.gameObjectObserver = createGameObjectObserver({
      components: [
        RIGID_BODY_COMPONENT_NAME,
        TRANSFORM_COMPONENT_NAME,
      ],
    });
    this.store = store;
    this.messageBus = messageBus;
    this.gravitationalAcceleration = gravitationalAcceleration;

    this.gameObjectsVelocity = {};
  }

  mount(): void {
    this.store.set(GRAVITATIONAL_ACCELERATION_STORE_KEY, this.gravitationalAcceleration);
    this.gameObjectObserver.subscribe('onremove', this.handleGameObjectRemove);
  }

  unmount(): void {
    this.gameObjectObserver.unsubscribe('onremove', this.handleGameObjectRemove);
  }

  private handleGameObjectRemove = (gameObject: GameObject): void => {
    this.gameObjectsVelocity = filterByKey(this.gameObjectsVelocity, gameObject.getId());
  };

  private applyDragForce(gameObject: GameObject, deltaTime: number): void {
    const { mass, drag } = gameObject.getComponent(RIGID_BODY_COMPONENT_NAME) as RigidBody;
    const gameObjectId = gameObject.getId();
    const velocity = this.gameObjectsVelocity[gameObjectId];

    if (!drag || !velocity || (!velocity.x && !velocity.y)) {
      return;
    }

    const velocitySignX = Math.sign(velocity.x);
    const velocitySignY = Math.sign(velocity.y);

    const reactionForceValue = mass * this.gravitationalAcceleration;
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

  private getGravityForce(rigidBody: RigidBody): Vector2 {
    const { mass, useGravity } = rigidBody;

    const gravityVector = new Vector2(0, 0);

    if (useGravity) {
      gravityVector.add(DIRECTION_VECTOR.DOWN);
      gravityVector.multiplyNumber(mass * this.gravitationalAcceleration);
    }

    return gravityVector;
  }

  private getForceVector(gameObject: GameObject): Vector2 {
    const gameObjectId = gameObject.getId();
    const rigidBody = gameObject.getComponent(RIGID_BODY_COMPONENT_NAME) as RigidBody;

    const forceVector = new Vector2(0, 0);

    forceVector.add(this.getGravityForce(rigidBody));

    const addForceMessages = (
      this.messageBus.getById(ADD_FORCE_MSG, gameObjectId) || []
    ) as Array<AddForceMessage>;
    addForceMessages.forEach((message) => forceVector.add(message.value));

    return forceVector;
  }

  private getImpulseVector(gameObject: GameObject): Vector2 {
    const gameObjectId = gameObject.getId();
    const addImpulseMessages = (
      this.messageBus.getById(ADD_IMPULSE_MSG, gameObjectId) || []
    ) as Array<AddImpulseMessage>;

    return addImpulseMessages.reduce((vector, message) => {
      vector.add(message.value);

      return vector;
    }, new Vector2(0, 0));
  }

  private processConstraints(): void {
    const stopMovementMessages = this.messageBus.get(STOP_MOVEMENT_MSG) || [];

    stopMovementMessages.forEach((message) => {
      const { gameObject } = message as StopMovementMessage;
      const gameObjectId = gameObject.getId();

      if (this.gameObjectsVelocity[gameObjectId]) {
        this.gameObjectsVelocity[gameObjectId].multiplyNumber(0);
      }
    });
  }

  update(options: UpdateOptions): void {
    const { deltaTime } = options;
    const deltaTimeInMsec = deltaTime;
    const deltaTimeInSeconds = deltaTimeInMsec / 1000;

    this.gameObjectObserver.fireEvents();

    this.processConstraints();

    this.gameObjectObserver.forEach((gameObject) => {
      const gameObjectId = gameObject.getId();
      const rigidBody = gameObject.getComponent(RIGID_BODY_COMPONENT_NAME) as RigidBody;
      const transform = gameObject.getComponent(TRANSFORM_COMPONENT_NAME) as Transform;
      const { mass } = rigidBody;

      const forceVector = this.getForceVector(gameObject);
      const impulseVector = this.getImpulseVector(gameObject);

      this.gameObjectsVelocity[gameObjectId] = this.gameObjectsVelocity[gameObjectId]
        || new Vector2(0, 0);

      const velocityVector = this.gameObjectsVelocity[gameObjectId];

      if (forceVector.x || forceVector.y) {
        forceVector.multiplyNumber(deltaTimeInSeconds / mass);
        velocityVector.add(forceVector);
      }

      if (impulseVector.x || impulseVector.y) {
        impulseVector.multiplyNumber(1 / mass);
        velocityVector.add(impulseVector);
      }

      this.applyDragForce(gameObject, deltaTimeInSeconds);

      transform.offsetX += velocityVector.x * deltaTimeInSeconds;
      transform.offsetY += velocityVector.y * deltaTimeInSeconds;
    });
  }
}

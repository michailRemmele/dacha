import type { System, SystemOptions, UpdateOptions } from '../../../engine/system';
import type { Entity, EntityObserver } from '../../../engine/entity';
import type { MessageBus, Message } from '../../../engine/message-bus';
import type { Store } from '../../../engine/scene';
import type { RigidBody } from '../../components/rigid-body';
import type { Transform } from '../../components/transform';
import { Vector2 } from '../../../engine/mathLib';
import { filterByKey } from '../../../engine/utils';

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

interface AddForceMessage extends Message {
  value: Vector2
}

interface AddImpulseMessage extends Message {
  value: Vector2
}

interface StopMovementMessage extends Message {
  entity: Entity
}

interface PhysicsSystemOptions extends SystemOptions {
  gravitationalAcceleration: number;
}

export class PhysicsSystem implements System {
  private entityObserver: EntityObserver;
  private store: Store;
  private messageBus: MessageBus;
  private gravitationalAcceleration: number;
  private entitiesVelocity: Record<string, Vector2>;

  constructor(options: PhysicsSystemOptions) {
    const {
      gravitationalAcceleration, createEntityObserver, store, messageBus,
    } = options;

    this.entityObserver = createEntityObserver({
      components: [
        RIGID_BODY_COMPONENT_NAME,
        TRANSFORM_COMPONENT_NAME,
      ],
    });
    this.store = store;
    this.messageBus = messageBus;
    this.gravitationalAcceleration = gravitationalAcceleration;

    this.entitiesVelocity = {};
  }

  mount(): void {
    this.store.set(GRAVITATIONAL_ACCELERATION_STORE_KEY, this.gravitationalAcceleration);
    this.entityObserver.subscribe('onremove', this.handleEntityRemove);
  }

  unmount(): void {
    this.entityObserver.unsubscribe('onremove', this.handleEntityRemove);
  }

  private handleEntityRemove = (entity: Entity): void => {
    this.entitiesVelocity = filterByKey(this.entitiesVelocity, entity.getId());
  };

  private applyDragForce(entity: Entity, deltaTime: number): void {
    const { mass, drag } = entity.getComponent(RIGID_BODY_COMPONENT_NAME) as RigidBody;
    const entityId = entity.getId();
    const velocity = this.entitiesVelocity[entityId];

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

  private getForceVector(entity: Entity): Vector2 {
    const entityId = entity.getId();
    const rigidBody = entity.getComponent(RIGID_BODY_COMPONENT_NAME) as RigidBody;

    const forceVector = new Vector2(0, 0);

    forceVector.add(this.getGravityForce(rigidBody));

    const addForceMessages = (
      this.messageBus.getById(ADD_FORCE_MSG, entityId) || []
    ) as Array<AddForceMessage>;
    addForceMessages.forEach((message) => forceVector.add(message.value));

    return forceVector;
  }

  private getImpulseVector(entity: Entity): Vector2 {
    const entityId = entity.getId();
    const addImpulseMessages = (
      this.messageBus.getById(ADD_IMPULSE_MSG, entityId) || []
    ) as Array<AddImpulseMessage>;

    return addImpulseMessages.reduce((vector, message) => {
      vector.add(message.value);

      return vector;
    }, new Vector2(0, 0));
  }

  private processConstraints(): void {
    const stopMovementMessages = this.messageBus.get(STOP_MOVEMENT_MSG) || [];

    stopMovementMessages.forEach((message) => {
      const { entity } = message as StopMovementMessage;
      const entityId = entity.getId();

      if (this.entitiesVelocity[entityId]) {
        this.entitiesVelocity[entityId].multiplyNumber(0);
      }
    });
  }

  update(options: UpdateOptions): void {
    const { deltaTime } = options;
    const deltaTimeInMsec = deltaTime;
    const deltaTimeInSeconds = deltaTimeInMsec / 1000;

    this.entityObserver.fireEvents();

    this.processConstraints();

    this.entityObserver.forEach((entity) => {
      const entityId = entity.getId();
      const rigidBody = entity.getComponent(RIGID_BODY_COMPONENT_NAME) as RigidBody;
      const transform = entity.getComponent(TRANSFORM_COMPONENT_NAME) as Transform;
      const { mass } = rigidBody;

      const forceVector = this.getForceVector(entity);
      const impulseVector = this.getImpulseVector(entity);

      this.entitiesVelocity[entityId] = this.entitiesVelocity[entityId]
        || new Vector2(0, 0);

      const velocityVector = this.entitiesVelocity[entityId];

      if (forceVector.x || forceVector.y) {
        forceVector.multiplyNumber(deltaTimeInSeconds / mass);
        velocityVector.add(forceVector);
      }

      if (impulseVector.x || impulseVector.y) {
        impulseVector.multiplyNumber(1 / mass);
        velocityVector.add(impulseVector);
      }

      this.applyDragForce(entity, deltaTimeInSeconds);

      transform.offsetX += velocityVector.x * deltaTimeInSeconds;
      transform.offsetY += velocityVector.y * deltaTimeInSeconds;
    });
  }
}

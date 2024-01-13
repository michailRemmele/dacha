import { Vector2 } from '../../../../../engine/mathLib';
import type { SystemOptions, UpdateOptions } from '../../../../../engine/system';
import { GameObject } from '../../../../../engine/game-object';
import type { GameObjectObserver } from '../../../../../engine/game-object';
import { RigidBody } from '../../../../components/rigid-body';
import { Transform } from '../../../../components/transform';
import type { PhysicsSystemOptions } from '../../types';
import {
  AddForce,
  AddImpulse,
  StopMovement,
} from '../../../../events';
import type { AddForceEvent, AddImpulseEvent } from '../../../../events';
import { AddGameObject, RemoveGameObject } from '../../../../../engine/events';
import type { UpdateGameObjectEvent } from '../../../../../engine/events';
import type { GameObjectEvent } from '../../../../../types/events';

const DIRECTION_VECTOR = {
  UP: new Vector2(0, -1),
  LEFT: new Vector2(-1, 0),
  RIGHT: new Vector2(1, 0),
  DOWN: new Vector2(0, 1),
};

export class PhysicsSubsystem {
  private gameObjectObserver: GameObjectObserver;
  private gravitationalAcceleration: number;
  private gameObjectsVelocity: Record<string, Vector2>;
  private gameObjectsForceVector: Record<string, Vector2>;
  private gameObjectsImpulseVector: Record<string, Vector2>;

  constructor(options: SystemOptions) {
    const {
      gravitationalAcceleration, createGameObjectObserver,
    } = options as PhysicsSystemOptions;

    this.gameObjectObserver = createGameObjectObserver({
      components: [
        RigidBody,
        Transform,
      ],
    });
    this.gravitationalAcceleration = gravitationalAcceleration;

    this.gameObjectsVelocity = {};
    this.gameObjectsForceVector = {};
    this.gameObjectsImpulseVector = {};

    this.gameObjectObserver.forEach(this.handleGameObjectAdd);
  }

  mount(): void {
    this.gameObjectObserver.addEventListener(AddGameObject, this.handleGameObjectAdd);
    this.gameObjectObserver.addEventListener(RemoveGameObject, this.handleGameObjectRemove);
  }

  unmount(): void {
    this.gameObjectObserver.removeEventListener(AddGameObject, this.handleGameObjectAdd);
    this.gameObjectObserver.removeEventListener(RemoveGameObject, this.handleGameObjectRemove);
  }

  private handleGameObjectAdd = (value: UpdateGameObjectEvent | GameObject): void => {
    const gameObject = value instanceof GameObject ? value : value.gameObject;

    this.gameObjectsVelocity[gameObject.id] = new Vector2(0, 0);
    this.gameObjectsForceVector[gameObject.id] = new Vector2(0, 0);
    this.gameObjectsImpulseVector[gameObject.id] = new Vector2(0, 0);

    gameObject.addEventListener(StopMovement, this.handleStopMovement);
    gameObject.addEventListener(AddForce, this.handleAddForce);
    gameObject.addEventListener(AddImpulse, this.handleAddImpulse);
  };

  private handleGameObjectRemove = (event: UpdateGameObjectEvent): void => {
    const { gameObject } = event;

    delete this.gameObjectsVelocity[gameObject.id];
    delete this.gameObjectsForceVector[gameObject.id];
    delete this.gameObjectsImpulseVector[gameObject.id];

    gameObject.removeEventListener(StopMovement, this.handleStopMovement);
    gameObject.removeEventListener(AddForce, this.handleAddForce);
    gameObject.removeEventListener(AddImpulse, this.handleAddImpulse);
  };

  private handleStopMovement = (event: GameObjectEvent): void => {
    if (this.gameObjectsVelocity[event.target.id]) {
      this.gameObjectsVelocity[event.target.id].multiplyNumber(0);
    }
  };

  private handleAddForce = (event: AddForceEvent): void => {
    const { target, value } = event;
    this.gameObjectsForceVector[target.id].add(value);
  };

  private handleAddImpulse = (event: AddImpulseEvent): void => {
    const { target, value } = event;
    this.gameObjectsImpulseVector[target.id].add(value);
  };

  private applyDragForce(gameObject: GameObject, deltaTime: number): void {
    const { mass, drag } = gameObject.getComponent(RigidBody);
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

  update(options: UpdateOptions): void {
    const { deltaTime } = options;
    const deltaTimeInMsec = deltaTime;
    const deltaTimeInSeconds = deltaTimeInMsec / 1000;

    this.gameObjectObserver.forEach((gameObject) => {
      const gameObjectId = gameObject.getId();
      const rigidBody = gameObject.getComponent(RigidBody);
      const transform = gameObject.getComponent(Transform);
      const { mass } = rigidBody;

      const forceVector = this.gameObjectsForceVector[gameObject.id];
      forceVector.add(this.getGravityForce(rigidBody));

      const impulseVector = this.gameObjectsImpulseVector[gameObject.id];

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

      this.gameObjectsForceVector[gameObject.id].multiplyNumber(0);
      this.gameObjectsImpulseVector[gameObject.id].multiplyNumber(0);
    });
  }
}

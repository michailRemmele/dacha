import { SceneSystem } from '../../../engine/system';
import type { SceneSystemOptions } from '../../../engine/system';
import type { World } from '../../../engine/world';
import { Vector2 } from '../../../engine/math-lib';

import {
  PhysicsSubsystem,
  CollisionDetectionSubsystem,
  CollisionBroadcastSubsystem,
  ConstraintSolver,
} from './subsystems';
import { PhysicsAPI } from './api';
import { DEFAULT_GRAVITY_X, DEFAULT_GRAVITY_Y } from './consts';
import type { PhysicsSystemOptions, CastHit, OverlapHit } from './types';

/**
 * Physics system that handles 2D physics simulation and collision detection
 *
 * Manages rigid body physics and collision detection and resolution.
 *
 * @extends SceneSystem
 *
 * @category Systems
 */
export class PhysicsSystem extends SceneSystem {
  private world: World;
  private physicsSubsystem: PhysicsSubsystem;
  private collisionDetectionSubsystem: CollisionDetectionSubsystem;
  private collisionBroadcastSubsystem: CollisionBroadcastSubsystem;
  private constraintSolver: ConstraintSolver;
  private physicsApi: PhysicsAPI;
  private gravity: Vector2;

  constructor(options: SceneSystemOptions) {
    super();

    const {
      gravityX = DEFAULT_GRAVITY_X,
      gravityY = DEFAULT_GRAVITY_Y,
      solverIterations,
      linearSleepThreshold,
      angularSleepThreshold,
      sleepTimeThreshold,
      maxAllowedPenetration,
      maxBiasVelocity,
    } = options as PhysicsSystemOptions;

    this.gravity = new Vector2(gravityX, gravityY);

    this.world = options.world;
    this.physicsSubsystem = new PhysicsSubsystem({
      scene: options.scene,
      time: options.time,
      getGravity: (): Vector2 => this.gravity,
      linearSleepThreshold,
      angularSleepThreshold,
      sleepTimeThreshold,
    });
    this.collisionDetectionSubsystem = new CollisionDetectionSubsystem(options);
    this.collisionBroadcastSubsystem = new CollisionBroadcastSubsystem();
    this.constraintSolver = new ConstraintSolver({
      time: options.time,
      getGravity: (): Vector2 => this.gravity,
      solverIterations,
      maxAllowedPenetration,
      maxBiasVelocity,
      linearSleepThreshold,
    });

    this.physicsApi = new PhysicsAPI({
      raycast: (params): CastHit | null =>
        this.collisionDetectionSubsystem.raycast(params),
      raycastAll: (params): CastHit[] =>
        this.collisionDetectionSubsystem.raycastAll(params),
      overlapShape: (params): OverlapHit[] =>
        this.collisionDetectionSubsystem.overlapShape(params),
      overlapActor: (params): OverlapHit[] =>
        this.collisionDetectionSubsystem.overlapActor(params),
      shapeCast: (params): CastHit | null =>
        this.collisionDetectionSubsystem.shapeCast(params),
      shapeCastAll: (params): CastHit[] =>
        this.collisionDetectionSubsystem.shapeCastAll(params),
      castActor: (params): CastHit | null =>
        this.collisionDetectionSubsystem.castActor(params),
      castActorAll: (params): CastHit[] =>
        this.collisionDetectionSubsystem.castActorAll(params),
      raycastEach: (params, callback): void =>
        this.collisionDetectionSubsystem.raycastEach(params, callback),
      shapeCastEach: (params, callback): void =>
        this.collisionDetectionSubsystem.shapeCastEach(params, callback),
      overlapEach: (params, callback): void =>
        this.collisionDetectionSubsystem.overlapEach(params, callback),
      castActorEach: (params, callback): void =>
        this.collisionDetectionSubsystem.castActorEach(params, callback),
      overlapActorEach: (params, callback): void =>
        this.collisionDetectionSubsystem.overlapActorEach(params, callback),
      getGravity: (): Vector2 => this.gravity,
      setGravity: (gravity): void => {
        this.gravity = gravity;
      },
    });
  }

  onSceneEnter(): void {
    this.world.systemApi.register(this.physicsApi);
  }

  onSceneExit(): void {
    this.world.systemApi.unregister(PhysicsAPI);
  }

  onSceneDestroy(): void {
    this.physicsSubsystem.destroy();
    this.collisionDetectionSubsystem.destroy();
  }

  fixedUpdate(): void {
    this.physicsSubsystem.integrateVelocities();
    this.physicsSubsystem.integrateKinematicPositions();

    const contacts = this.collisionDetectionSubsystem.update();

    this.constraintSolver.update(contacts);

    this.physicsSubsystem.integrateDynamicPositions();
    this.physicsSubsystem.updateSleepTimers();

    this.collisionBroadcastSubsystem.update(contacts);

    this.physicsSubsystem.lateUpdate();
  }
}

PhysicsSystem.systemName = 'PhysicsSystem';

import { SceneSystem } from '../../../engine/system';
import type { SceneSystemOptions } from '../../../engine/system';
import type { World } from '../../../engine/world';
import { Vector } from '../../../engine/math-lib';

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
 * Moves rigid bodies and resolves collisions between them.
 *
 * The system works with actors that have a {@link RigidBody} and a {@link Collider}.
 * It sends {@link CollisionEnterEvent | CollisionEnter}, {@link CollisionStayEvent | CollisionStay} and {@link CollisionLeaveEvent | CollisionLeave}
 * to the actors that collide. It registers {@link PhysicsAPI} in `world.systemApi` for
 * raycasts, shape casts and overlap queries.
 *
 * The options are in {@link PhysicsSystemOptions}. The global option `physics` holds the
 * collision layers, see {@link PhysicsSettings}.
 *
 * The system works in `fixedUpdate`. Put it after the systems that control bodies in
 * `fixedUpdate`: the ones that apply forces, set velocity or call `movePosition`.
 *
 * @see [Physics](https://dachajs.org/systems/physics/)
 *
 * @category Physics
 */
export class PhysicsSystem extends SceneSystem {
  private world: World;
  private physicsSubsystem: PhysicsSubsystem;
  private collisionDetectionSubsystem: CollisionDetectionSubsystem;
  private collisionBroadcastSubsystem: CollisionBroadcastSubsystem;
  private constraintSolver: ConstraintSolver;
  private physicsApi: PhysicsAPI;
  private gravity: Vector;

  constructor(options: SceneSystemOptions) {
    super();

    const {
      gravityX = DEFAULT_GRAVITY_X,
      gravityY = DEFAULT_GRAVITY_Y,
      solverIterations,
      maxAllowedPenetration,
      maxBiasVelocity,
    } = options as PhysicsSystemOptions;

    this.gravity = new Vector(gravityX, gravityY);

    this.world = options.world;
    this.physicsSubsystem = new PhysicsSubsystem({
      scene: options.scene,
      time: options.time,
      getGravity: (): Vector => this.gravity,
    });
    this.collisionDetectionSubsystem = new CollisionDetectionSubsystem(options);
    this.collisionBroadcastSubsystem = new CollisionBroadcastSubsystem();
    this.constraintSolver = new ConstraintSolver({
      time: options.time,
      getGravity: (): Vector => this.gravity,
      solverIterations,
      maxAllowedPenetration,
      maxBiasVelocity,
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
      getGravity: (): Vector => this.gravity,
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

    this.collisionBroadcastSubsystem.update(contacts);

    this.physicsSubsystem.lateUpdate();
  }
}

PhysicsSystem.systemName = 'PhysicsSystem';

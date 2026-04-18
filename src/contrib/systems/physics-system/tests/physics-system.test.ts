import { Vector2 } from '../../../../engine/math-lib';
import { ActorCreator, ActorSpawner, Actor } from '../../../../engine/actor';
import { Scene } from '../../../../engine/scene';
import { TemplateCollection } from '../../../../engine/template';
import { World } from '../../../../engine/world';
import { Collider, RigidBody } from '../../../components';
import { Transform } from '../../../components/transform';
import { PhysicsSystem, PhysicsAPI } from '../index';
import type { PhysicsSettings } from '../types';

const createScene = (): Scene => {
  const templateCollection = new TemplateCollection([]);
  const actorCreator = new ActorCreator([], templateCollection);

  return new Scene({
    id: 'scene',
    name: 'scene',
    actors: [],
    actorCreator,
    templateCollection,
  });
};

const createPhysicsSystem = (
  scene: Scene,
  settings?: PhysicsSettings,
): { physicsSystem: PhysicsSystem; world: World } => {
  const world = new World({ id: 'world', name: 'world' });
  const templateCollection = new TemplateCollection([]);
  const actorCreator = new ActorCreator([], templateCollection);

  world.appendChild(scene);

  const physicsSystem = new PhysicsSystem({
    scene,
    world,
    gravity: 0,
    actorSpawner: new ActorSpawner(actorCreator),
    globalOptions: settings ? { physics: settings } : {},
    templateCollection,
  });

  physicsSystem.onSceneEnter?.();

  return { physicsSystem, world };
};

const createBoxActor = (
  id: string,
  type: 'dynamic' | 'static',
  positionX: number,
  positionY: number,
  colliderConfig: Pick<Collider, 'layer'> = { layer: 'default' },
): Actor => {
  const actor = new Actor({ id, name: id });
  const transform = actor.getComponent(Transform);

  transform.world.position.x = positionX;
  transform.world.position.y = positionY;
  actor.setComponent(
    new Collider({
      type: 'box',
      centerX: 0,
      centerY: 0,
      sizeX: 2,
      sizeY: 2,
      layer: colliderConfig.layer,
    }),
  );
  actor.setComponent(
    new RigidBody({
      type,
      mass: 1,
      gravityScale: 0,
      linearDamping: 0,
      disabled: false,
    }),
  );

  return actor;
};

const createCircleActor = (
  id: string,
  positionX: number,
  positionY: number,
  radius: number,
  colliderConfig: Pick<Collider, 'layer'> = { layer: 'default' },
): Actor => {
  const actor = new Actor({ id, name: id });
  const transform = actor.getComponent(Transform);

  transform.world.position.x = positionX;
  transform.world.position.y = positionY;
  actor.setComponent(
    new Collider({
      type: 'circle',
      centerX: 0,
      centerY: 0,
      radius,
      layer: colliderConfig.layer,
    }),
  );

  return actor;
};

const createSegmentActor = (
  id: string,
  positionX: number,
  positionY: number,
  point1X: number,
  point1Y: number,
  point2X: number,
  point2Y: number,
  type?: 'dynamic' | 'static',
  colliderConfig: Pick<Collider, 'layer'> = { layer: 'default' },
): Actor => {
  const actor = new Actor({ id, name: id });
  const transform = actor.getComponent(Transform);

  transform.world.position.x = positionX;
  transform.world.position.y = positionY;
  actor.setComponent(
    new Collider({
      type: 'segment',
      centerX: 0,
      centerY: 0,
      point1X,
      point1Y,
      point2X,
      point2Y,
      layer: colliderConfig.layer,
    }),
  );

  if (type) {
    actor.setComponent(
      new RigidBody({
        type,
        mass: 1,
        gravityScale: 0,
        linearDamping: 0,
        disabled: false,
      }),
    );
  }

  return actor;
};

describe('PhysicsSystem', () => {
  it('Stops a falling body from continuing through a static floor', () => {
    const scene = createScene();
    const { physicsSystem } = createPhysicsSystem(scene);
    const floor = createBoxActor('floor', 'static', 0, 3);
    const body = createBoxActor('body', 'dynamic', 0, 0);
    const rigidBody = body.getComponent(RigidBody);
    const transform = body.getComponent(Transform);

    rigidBody.linearVelocity.y = 15;

    scene.appendChild(floor);
    scene.appendChild(body);

    physicsSystem.fixedUpdate({ deltaTime: 100 });
    physicsSystem.fixedUpdate({ deltaTime: 100 });
    physicsSystem.fixedUpdate({ deltaTime: 100 });

    expect(rigidBody.linearVelocity.y).toBeCloseTo(0);
    expect(transform.world.position.y).toBeLessThanOrEqual(1.02);
  });

  it('Skips collision resolution when collision matrix disables a pair', () => {
    const scene = createScene();
    const { physicsSystem } = createPhysicsSystem(scene, {
      collisionLayers: [
        { id: 'body', name: 'Body' },
        { id: 'floor', name: 'Floor' },
      ],
      collisionMatrix: {
        body: { floor: false },
        floor: { body: false },
      },
    });
    const floor = createBoxActor('floor', 'static', 0, 3, {
      layer: 'floor',
    });
    const body = createBoxActor('body', 'dynamic', 0, 0, {
      layer: 'body',
    });
    const rigidBody = body.getComponent(RigidBody);
    const transform = body.getComponent(Transform);

    rigidBody.linearVelocity.y = 15;

    scene.appendChild(floor);
    scene.appendChild(body);

    physicsSystem.fixedUpdate({ deltaTime: 100 });
    physicsSystem.fixedUpdate({ deltaTime: 100 });
    physicsSystem.fixedUpdate({ deltaTime: 100 });

    expect(rigidBody.linearVelocity.y).toBeCloseTo(15);
    expect(transform.world.position.y).toBeGreaterThan(1.02);
  });

  it('Raycasts against the nearest collider and returns hit data', () => {
    const scene = createScene();
    const { world } = createPhysicsSystem(scene);
    const physicsApi = world.systemApi.get(PhysicsAPI);
    const box = createBoxActor('box', 'static', 4, 0);

    scene.appendChild(box);

    const hit = physicsApi.raycast({
      origin: { x: 0, y: 0 },
      direction: new Vector2(1, 0),
      maxDistance: 10,
    });

    expect(hit?.actor.id).toBe('box');
    expect(hit?.distance).toBeCloseTo(3);
    expect(hit?.point.x).toBeCloseTo(3);
    expect(hit?.point.y).toBeCloseTo(0);
    expect(hit?.normal.x).toBeCloseTo(-1);
    expect(hit?.normal.y).toBeCloseTo(0);
  });

  it('Returns raycast hits in distance order and filters by collision layer', () => {
    const scene = createScene();
    const { world } = createPhysicsSystem(scene, {
      collisionLayers: [
        { id: 'solid', name: 'solid' },
        { id: 'sensor', name: 'sensor' },
      ],
      collisionMatrix: {
        solid: {
          sensor: false,
        },
        sensor: {
          sensor: true,
        },
      },
    });
    const physicsApi = world.systemApi.get(PhysicsAPI);
    const nearBox = createBoxActor('near-box', 'static', 4, 0, {
      layer: 'solid',
    });
    const farCircle = createCircleActor('far-circle', 8, 0, 1, {
      layer: 'sensor',
    });

    scene.appendChild(nearBox);
    scene.appendChild(farCircle);

    const allHits = physicsApi.raycastAll({
      origin: { x: 0, y: 0 },
      direction: new Vector2(1, 0),
      maxDistance: 12,
    });
    const filteredHits = physicsApi.raycastAll({
      origin: { x: 0, y: 0 },
      direction: new Vector2(1, 0),
      maxDistance: 12,
      layer: 'sensor',
    });

    expect(allHits.map((hit) => hit.actor.id)).toStrictEqual([
      'near-box',
      'far-circle',
    ]);
    expect(filteredHits.map((hit) => hit.actor.id)).toStrictEqual([
      'far-circle',
    ]);
  });

  it('Finds overlaps for point, box, and circle queries', () => {
    const scene = createScene();
    const { world } = createPhysicsSystem(scene);
    const physicsApi = world.systemApi.get(PhysicsAPI);
    const box = createBoxActor('box', 'static', 2, 2, {
      layer: 'solid',
    });
    const circle = createCircleActor('circle', 7, 2, 1.5, {
      layer: 'sensor',
    });

    scene.appendChild(box);
    scene.appendChild(circle);

    expect(
      physicsApi
        .overlapPoint({
          point: { x: 2, y: 2 },
        })
        .map((actor) => actor.id),
    ).toStrictEqual(['box']);

    expect(
      physicsApi
        .overlapBox({
          center: { x: 2, y: 2 },
          size: { x: 4, y: 4 },
        })
        .map((actor) => actor.id),
    ).toStrictEqual(['box']);

    expect(
      physicsApi
        .overlapCircle({
          center: { x: 7, y: 2 },
          radius: 1,
          layer: 'sensor',
        })
        .map((actor) => actor.id),
    ).toStrictEqual(['circle']);
  });

  it('Raycasts against segment colliders', () => {
    const scene = createScene();
    const { world } = createPhysicsSystem(scene);
    const physicsApi = world.systemApi.get(PhysicsAPI);
    const segment = createSegmentActor('segment', 4, 0, 0, -2, 0, 2);

    scene.appendChild(segment);

    const firstHit = physicsApi.raycast({
      origin: { x: 0, y: 0 },
      direction: new Vector2(1, 0),
      maxDistance: 12,
    });
    const allHits = physicsApi.raycastAll({
      origin: { x: 0, y: 0 },
      direction: new Vector2(1, 0),
      maxDistance: 12,
    });

    expect(firstHit?.actor.id).toBe('segment');
    expect(firstHit?.distance).toBeCloseTo(4);
    expect(allHits.map((hit) => hit.actor.id)).toStrictEqual(['segment']);
  });

  it('Supports overlap queries against segment colliders', () => {
    const scene = createScene();
    const { world } = createPhysicsSystem(scene);
    const physicsApi = world.systemApi.get(PhysicsAPI);
    const segment = createSegmentActor('segment', 4, 0, -2, 0, 2, 0);

    scene.appendChild(segment);

    expect(
      physicsApi
        .overlapPoint({
          point: { x: 4, y: 0 },
        })
        .map((actor) => actor.id),
    ).toStrictEqual(['segment']);
  });

  it('Resolves a falling circle against a static segment floor', () => {
    const scene = createScene();
    const { physicsSystem } = createPhysicsSystem(scene);
    const floor = createSegmentActor('floor', 0, 3, -5, 0, 5, 0, 'static');
    const body = createCircleActor('body', 0, 0, 0.75);
    body.setComponent(
      new RigidBody({
        type: 'dynamic',
        mass: 1,
        gravityScale: 0,
        linearDamping: 0,
        disabled: false,
      }),
    );
    const rigidBody = body.getComponent(RigidBody);
    const transform = body.getComponent(Transform);

    rigidBody.linearVelocity.y = 15;

    scene.appendChild(floor);
    scene.appendChild(body);

    physicsSystem.fixedUpdate({ deltaTime: 100 });
    physicsSystem.fixedUpdate({ deltaTime: 100 });
    physicsSystem.fixedUpdate({ deltaTime: 100 });

    expect(rigidBody.linearVelocity.y).toBeCloseTo(0);
    expect(transform.world.position.y).toBeLessThanOrEqual(2.3);
  });
});

import { Vector2 } from '../../../../engine/math-lib';
import { PhysicsAPI } from '../index';

import {
  createBoxActor,
  createCapsuleActor,
  createCircleActor,
  createPhysicsSystem,
  createScene,
  createSegmentActor,
} from './helpers';

describe('Systems -> PhysicsSystem -> queries', () => {
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
        .overlapShape({
          shape: {
            type: 'point',
            point: { x: 2, y: 2 },
          },
        })
        .map((actor) => actor.id),
    ).toStrictEqual(['box']);

    expect(
      physicsApi
        .overlapShape({
          shape: {
            type: 'box',
            center: { x: 2, y: 2 },
            size: { x: 4, y: 4 },
          },
        })
        .map((actor) => actor.id),
    ).toStrictEqual(['box']);

    expect(
      physicsApi
        .overlapShape({
          shape: {
            type: 'circle',
            center: { x: 7, y: 2 },
            radius: 1,
          },
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
        .overlapShape({
          shape: {
            type: 'point',
            point: { x: 4, y: 0 },
          },
        })
        .map((actor) => actor.id),
    ).toStrictEqual(['segment']);
  });

  it('Raycasts and overlaps capsule colliders', () => {
    const scene = createScene();
    const { world } = createPhysicsSystem(scene);
    const physicsApi = world.systemApi.get(PhysicsAPI);
    const capsule = createCapsuleActor('capsule', 4, 0, -2, 0, 2, 0, 1);

    scene.appendChild(capsule);

    const hit = physicsApi.raycast({
      origin: { x: 0, y: 0 },
      direction: new Vector2(1, 0),
      maxDistance: 12,
    });

    expect(hit?.actor.id).toBe('capsule');
    expect(hit?.distance).toBeCloseTo(1);
    expect(hit?.point.x).toBeCloseTo(1);
    expect(hit?.point.y).toBeCloseTo(0);

    expect(
      physicsApi
        .overlapShape({
          shape: {
            type: 'circle',
            center: { x: 4, y: 1.25 },
            radius: 0.5,
          },
        })
        .map((actor) => actor.id),
    ).toStrictEqual(['capsule']);
  });

  it('Supports capsule overlap queries', () => {
    const scene = createScene();
    const { world } = createPhysicsSystem(scene);
    const physicsApi = world.systemApi.get(PhysicsAPI);
    const circle = createCircleActor('circle', 3, 1, 1);

    scene.appendChild(circle);

    expect(
      physicsApi
        .overlapShape({
          shape: {
            type: 'capsule',
            point1: { x: -2, y: 0 },
            point2: { x: 2, y: 0 },
            radius: 1,
          },
        })
        .map((actor) => actor.id),
    ).toStrictEqual(['circle']);
  });

  it('Shape-casts circle queries against colliders', () => {
    const scene = createScene();
    const { world } = createPhysicsSystem(scene);
    const physicsApi = world.systemApi.get(PhysicsAPI);
    const box = createBoxActor('box', 'static', 5, 0);

    scene.appendChild(box);

    const hit = physicsApi.shapeCast({
      shape: {
        type: 'circle',
        center: { x: 0, y: 0 },
        radius: 1,
      },
      direction: new Vector2(1, 0),
      maxDistance: 10,
    });

    expect(hit?.actor.id).toBe('box');
    expect(hit?.distance).toBeCloseTo(3);
    expect(hit?.point.x).toBeCloseTo(4);
    expect(hit?.point.y).toBeCloseTo(0);
    expect(hit?.normal.x).toBeCloseTo(-1);
    expect(hit?.normal.y).toBeCloseTo(0);
  });

  it('Shape-casts circle queries against round and segment colliders', () => {
    const scene = createScene();
    const { world } = createPhysicsSystem(scene);
    const physicsApi = world.systemApi.get(PhysicsAPI);
    const circle = createCircleActor('circle', 5, 0, 1);
    const segment = createSegmentActor('segment', 5, 5, 0, -2, 0, 2);
    const capsule = createCapsuleActor('capsule', 5, 10, -1, 0, 1, 0, 1);

    scene.appendChild(circle);
    scene.appendChild(segment);
    scene.appendChild(capsule);

    const circleHit = physicsApi.shapeCast({
      shape: {
        type: 'circle',
        center: { x: 0, y: 0 },
        radius: 1,
      },
      direction: new Vector2(1, 0),
      maxDistance: 10,
    });
    const segmentHit = physicsApi.shapeCast({
      shape: {
        type: 'circle',
        center: { x: 0, y: 5 },
        radius: 1,
      },
      direction: new Vector2(1, 0),
      maxDistance: 10,
    });
    const capsuleHit = physicsApi.shapeCast({
      shape: {
        type: 'circle',
        center: { x: 0, y: 10 },
        radius: 1,
      },
      direction: new Vector2(1, 0),
      maxDistance: 10,
    });

    expect(circleHit?.actor.id).toBe('circle');
    expect(circleHit?.distance).toBeCloseTo(3);
    expect(circleHit?.point.x).toBeCloseTo(4);
    expect(circleHit?.point.y).toBeCloseTo(0);

    expect(segmentHit?.actor.id).toBe('segment');
    expect(segmentHit?.distance).toBeCloseTo(4);
    expect(segmentHit?.point.x).toBeCloseTo(5);
    expect(segmentHit?.point.y).toBeCloseTo(5);

    expect(capsuleHit?.actor.id).toBe('capsule');
    expect(capsuleHit?.distance).toBeCloseTo(2);
    expect(capsuleHit?.point.x).toBeCloseTo(3);
    expect(capsuleHit?.point.y).toBeCloseTo(10);
  });

  it('Returns shape-cast hits in distance order and filters by collision layer', () => {
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
    const nearBox = createBoxActor('near-box', 'static', 5, 0, {
      layer: 'solid',
    });
    const farCircle = createCircleActor('far-circle', 8, 0, 1, {
      layer: 'sensor',
    });

    scene.appendChild(nearBox);
    scene.appendChild(farCircle);

    const allHits = physicsApi.shapeCastAll({
      shape: {
        type: 'circle',
        center: { x: 0, y: 0 },
        radius: 1,
      },
      direction: new Vector2(1, 0),
      maxDistance: 12,
    });
    const filteredHits = physicsApi.shapeCastAll({
      shape: {
        type: 'circle',
        center: { x: 0, y: 0 },
        radius: 1,
      },
      direction: new Vector2(1, 0),
      maxDistance: 12,
      layer: 'sensor',
    });

    expect(allHits.map((hit) => hit.actor.id)).toStrictEqual([
      'near-box',
      'far-circle',
    ]);
    expect(allHits.map((hit) => hit.distance)).toStrictEqual([3, 6]);
    expect(filteredHits.map((hit) => hit.actor.id)).toStrictEqual([
      'far-circle',
    ]);
  });

  it('Shape-cast initial overlaps return overlap contact points', () => {
    const scene = createScene();
    const { world } = createPhysicsSystem(scene);
    const physicsApi = world.systemApi.get(PhysicsAPI);
    const circle = createCircleActor('circle', 5, 0, 1);

    scene.appendChild(circle);

    const hit = physicsApi.shapeCast({
      shape: {
        type: 'circle',
        center: { x: 4.5, y: 0 },
        radius: 1,
      },
      direction: new Vector2(1, 0),
      maxDistance: 10,
    });

    expect(hit?.actor.id).toBe('circle');
    expect(hit?.distance).toBeCloseTo(0);
    expect(hit?.point.x).toBeCloseTo(4);
    expect(hit?.point.y).toBeCloseTo(0);
    expect(hit?.normal.x).toBeCloseTo(-1);
    expect(hit?.normal.y).toBeCloseTo(0);
  });
});

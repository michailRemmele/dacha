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

  it('Excludes actors from raycast, shape-cast, and overlap queries', () => {
    const scene = createScene();
    const { world } = createPhysicsSystem(scene);
    const physicsApi = world.systemApi.get(PhysicsAPI);
    const nearBox = createBoxActor('near-box', 'static', 4, 0);
    const farBox = createBoxActor('far-box', 'static', 8, 0);

    scene.appendChild(nearBox);
    scene.appendChild(farBox);

    const raycastHit = physicsApi.raycast({
      origin: { x: 0, y: 0 },
      direction: new Vector2(1, 0),
      maxDistance: 12,
      excludeActors: [nearBox],
    });
    const shapeCastHit = physicsApi.shapeCast({
      shape: {
        type: 'circle',
        center: { x: 0, y: 0 },
        radius: 1,
      },
      direction: new Vector2(1, 0),
      maxDistance: 12,
      excludeActors: [nearBox],
    });
    const overlaps = physicsApi.overlapShape({
      shape: {
        type: 'box',
        center: { x: 6, y: 0 },
        size: { x: 6, y: 2 },
      },
      excludeActors: [nearBox],
    });

    expect(raycastHit?.actor.id).toBe('far-box');
    expect(shapeCastHit?.actor.id).toBe('far-box');
    expect(overlaps.map((hit) => hit.actor.id)).toStrictEqual(['far-box']);
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
        .map((hit) => hit.actor.id),
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
        .map((hit) => hit.actor.id),
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
        .map((hit) => hit.actor.id),
    ).toStrictEqual(['circle']);
  });

  it('Returns overlap hit data and supports actor overlap queries', () => {
    const scene = createScene();
    const { world } = createPhysicsSystem(scene);
    const physicsApi = world.systemApi.get(PhysicsAPI);
    const query = createCircleActor('query', 0, 0, 1);
    const target = createCircleActor('target', 1.5, 0, 1);

    scene.appendChild(query);
    scene.appendChild(target);

    const shapeHits = physicsApi.overlapShape({
      shape: {
        type: 'circle',
        center: { x: 0, y: 0 },
        radius: 1,
      },
      excludeActors: [query],
    });
    const actorHits = physicsApi.overlapActor({ actor: query });

    expect(shapeHits.map((hit) => hit.actor.id)).toStrictEqual(['target']);
    expect(shapeHits[0].normal.x).toBeCloseTo(-1);
    expect(shapeHits[0].normal.y).toBeCloseTo(0);
    expect(shapeHits[0].penetration).toBeCloseTo(0.5);
    expect(shapeHits[0].contactPoints).toHaveLength(1);

    expect(actorHits.map((hit) => hit.actor.id)).toStrictEqual(['target']);
    expect(actorHits[0].normal.x).toBeCloseTo(-1);
    expect(actorHits[0].normal.y).toBeCloseTo(0);
    expect(actorHits[0].penetration).toBeCloseTo(0.5);
  });

  it('Overlaps actor from its current transform plus query offset', () => {
    const scene = createScene();
    const { world } = createPhysicsSystem(scene);
    const physicsApi = world.systemApi.get(PhysicsAPI);
    const query = createCircleActor('query', 0, 0, 1);
    const target = createCircleActor('target', 3, 0, 1);

    scene.appendChild(query);
    scene.appendChild(target);

    const hitsWithoutOffset = physicsApi.overlapActor({ actor: query });
    const hitsWithOffset = physicsApi.overlapActor({
      actor: query,
      offset: { x: 1.5, y: 0 },
    });

    expect(hitsWithoutOffset).toHaveLength(0);
    expect(hitsWithOffset.map((hit) => hit.actor.id)).toStrictEqual([
      'target',
    ]);
    expect(hitsWithOffset[0].normal.x).toBeCloseTo(-1);
    expect(hitsWithOffset[0].penetration).toBeCloseTo(0.5);
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
        .map((hit) => hit.actor.id),
    ).toStrictEqual(['segment']);
  });

  it('Raycasts and overlaps capsule colliders', () => {
    const scene = createScene();
    const { world } = createPhysicsSystem(scene);
    const physicsApi = world.systemApi.get(PhysicsAPI);
    const capsule = createCapsuleActor('capsule', 4, 0, 4, 1);

    scene.appendChild(capsule);

    const hit = physicsApi.raycast({
      origin: { x: 0, y: 0 },
      direction: new Vector2(1, 0),
      maxDistance: 12,
    });

    expect(hit?.actor.id).toBe('capsule');
    expect(hit?.distance).toBeCloseTo(3);
    expect(hit?.point.x).toBeCloseTo(3);
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
        .map((hit) => hit.actor.id),
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
            center: { x: 0, y: 0 },
            height: 4,
            radius: 1,
            rotation: -Math.PI / 2,
          },
        })
        .map((hit) => hit.actor.id),
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

  it('Shape-casts capsule queries against colliders', () => {
    const scene = createScene();
    const { world } = createPhysicsSystem(scene);
    const physicsApi = world.systemApi.get(PhysicsAPI);
    const circle = createCircleActor('circle', 5, 0, 1);
    const segment = createSegmentActor('segment', 5, 5, 0, -1, 0, 1);
    const capsule = createCapsuleActor('capsule', 5, 10, 2, 1);
    const box = createBoxActor('box', 'static', 5, 15);

    scene.appendChild(circle);
    scene.appendChild(segment);
    scene.appendChild(capsule);
    scene.appendChild(box);

    const circleHit = physicsApi.shapeCast({
      shape: {
        type: 'capsule',
        center: { x: 0, y: 0 },
        height: 4,
        radius: 1,
      },
      direction: new Vector2(1, 0),
      maxDistance: 10,
    });
    const segmentHit = physicsApi.shapeCast({
      shape: {
        type: 'capsule',
        center: { x: 0, y: 5 },
        height: 4,
        radius: 1,
      },
      direction: new Vector2(1, 0),
      maxDistance: 10,
    });
    const capsuleHit = physicsApi.shapeCast({
      shape: {
        type: 'capsule',
        center: { x: 0, y: 10 },
        height: 4,
        radius: 1,
      },
      direction: new Vector2(1, 0),
      maxDistance: 10,
    });
    const boxHit = physicsApi.shapeCast({
      shape: {
        type: 'capsule',
        center: { x: 0, y: 15 },
        height: 4,
        radius: 1,
      },
      direction: new Vector2(1, 0),
      maxDistance: 10,
    });

    expect(circleHit?.actor.id).toBe('circle');
    expect(segmentHit?.actor.id).toBe('segment');
    expect(capsuleHit?.actor.id).toBe('capsule');
    expect(boxHit?.actor.id).toBe('box');
  });

  it('Shape-casts box queries against colliders', () => {
    const scene = createScene();
    const { world } = createPhysicsSystem(scene);
    const physicsApi = world.systemApi.get(PhysicsAPI);
    const circle = createCircleActor('circle', 5, 0, 1);
    const segment = createSegmentActor('segment', 5, 5, 0, -1, 0, 1);
    const capsule = createCapsuleActor('capsule', 5, 10, 2, 1);
    const box = createBoxActor('box', 'static', 5, 15);

    scene.appendChild(circle);
    scene.appendChild(segment);
    scene.appendChild(capsule);
    scene.appendChild(box);

    const circleHit = physicsApi.shapeCast({
      shape: {
        type: 'box',
        center: { x: 0, y: 0 },
        size: { x: 2, y: 2 },
      },
      direction: new Vector2(1, 0),
      maxDistance: 10,
    });
    const segmentHit = physicsApi.shapeCast({
      shape: {
        type: 'box',
        center: { x: 0, y: 5 },
        size: { x: 2, y: 2 },
      },
      direction: new Vector2(1, 0),
      maxDistance: 10,
    });
    const capsuleHit = physicsApi.shapeCast({
      shape: {
        type: 'box',
        center: { x: 0, y: 10 },
        size: { x: 2, y: 2 },
      },
      direction: new Vector2(1, 0),
      maxDistance: 10,
    });
    const boxHit = physicsApi.shapeCast({
      shape: {
        type: 'box',
        center: { x: 0, y: 15 },
        size: { x: 2, y: 2 },
      },
      direction: new Vector2(1, 0),
      maxDistance: 10,
    });

    expect(circleHit?.actor.id).toBe('circle');
    expect(segmentHit?.actor.id).toBe('segment');
    expect(capsuleHit?.actor.id).toBe('capsule');
    expect(boxHit?.actor.id).toBe('box');
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

  it('Casts circle actor against colliders', () => {
    const scene = createScene();
    const { world } = createPhysicsSystem(scene);
    const physicsApi = world.systemApi.get(PhysicsAPI);
    const caster = createCircleActor('circle-caster', 0, 0, 1);
    const target = createBoxActor('circle-target', 'static', 5, 0);

    scene.appendChild(caster);
    scene.appendChild(target);

    const hit = physicsApi.castActor({
      actor: caster,
      direction: new Vector2(1, 0),
      maxDistance: 10,
    });

    expect(hit?.actor.id).toBe('circle-target');
    expect(hit?.distance).toBeCloseTo(3);
    expect(hit?.point.x).toBeCloseTo(4);
    expect(hit?.point.y).toBeCloseTo(0);
    expect(hit?.normal.x).toBeCloseTo(-1);
    expect(hit?.normal.y).toBeCloseTo(0);
  });

  it('Casts actor from its current transform plus query offset', () => {
    const scene = createScene();
    const { world } = createPhysicsSystem(scene);
    const physicsApi = world.systemApi.get(PhysicsAPI);
    const caster = createCircleActor('caster', 0, 0, 1);
    const target = createBoxActor('target', 'static', 5, 5);

    scene.appendChild(caster);
    scene.appendChild(target);

    const withoutOffsetHit = physicsApi.castActor({
      actor: caster,
      direction: new Vector2(1, 0),
      maxDistance: 10,
    });
    const offsetHit = physicsApi.castActor({
      actor: caster,
      offset: { x: 0, y: 5 },
      direction: new Vector2(1, 0),
      maxDistance: 10,
    });

    expect(withoutOffsetHit).toBeNull();
    expect(offsetHit?.actor.id).toBe('target');
    expect(offsetHit?.distance).toBeCloseTo(3);
    expect(offsetHit?.point.x).toBeCloseTo(4);
    expect(offsetHit?.point.y).toBeCloseTo(5);
  });

  it('Casts box actor against colliders', () => {
    const scene = createScene();
    const { world } = createPhysicsSystem(scene);
    const physicsApi = world.systemApi.get(PhysicsAPI);
    const caster = createBoxActor('box-caster', 'static', 0, 0);
    const target = createCircleActor('box-target', 5, 0, 1);

    scene.appendChild(caster);
    scene.appendChild(target);

    const hit = physicsApi.castActor({
      actor: caster,
      direction: new Vector2(1, 0),
      maxDistance: 10,
    });

    expect(hit?.actor.id).toBe('box-target');
  });

  it('Casts capsule actor against colliders', () => {
    const scene = createScene();
    const { world } = createPhysicsSystem(scene);
    const physicsApi = world.systemApi.get(PhysicsAPI);
    const caster = createCapsuleActor('capsule-caster', 0, 0, 2, 1);
    const target = createBoxActor('capsule-target', 'static', 5, 0);

    scene.appendChild(caster);
    scene.appendChild(target);

    const hit = physicsApi.castActor({
      actor: caster,
      direction: new Vector2(1, 0),
      maxDistance: 10,
    });

    expect(hit?.actor.id).toBe('capsule-target');
  });

  it('Returns actor-cast hits in distance order and filters by layer', () => {
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
    const caster = createCircleActor('caster', 0, 0, 1);
    const nearBox = createBoxActor('near-box', 'static', 5, 0, {
      layer: 'solid',
    });
    const farCircle = createCircleActor('far-circle', 8, 0, 1, {
      layer: 'sensor',
    });

    scene.appendChild(caster);
    scene.appendChild(nearBox);
    scene.appendChild(farCircle);

    const allHits = physicsApi.castActorAll({
      actor: caster,
      direction: new Vector2(1, 0),
      maxDistance: 12,
    });
    const filteredHits = physicsApi.castActorAll({
      actor: caster,
      direction: new Vector2(1, 0),
      maxDistance: 12,
      layer: 'sensor',
    });
    const excludedHit = physicsApi.castActor({
      actor: caster,
      direction: new Vector2(1, 0),
      maxDistance: 12,
      excludeActors: [nearBox],
    });

    expect(allHits.map((hit) => hit.actor.id)).toStrictEqual([
      'near-box',
      'far-circle',
    ]);
    expect(allHits.map((hit) => hit.distance)).toStrictEqual([3, 6]);
    expect(filteredHits.map((hit) => hit.actor.id)).toStrictEqual([
      'far-circle',
    ]);
    expect(excludedHit?.actor.id).toBe('far-circle');
  });

  it("Uses the cast actor's collider layer when layer is omitted", () => {
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
    const caster = createCircleActor('caster', 0, 0, 1, {
      layer: 'sensor',
    });
    const nearBox = createBoxActor('near-box', 'static', 5, 0, {
      layer: 'solid',
    });
    const farCircle = createCircleActor('far-circle', 8, 0, 1, {
      layer: 'sensor',
    });

    scene.appendChild(caster);
    scene.appendChild(nearBox);
    scene.appendChild(farCircle);

    const hits = physicsApi.castActorAll({
      actor: caster,
      direction: new Vector2(1, 0),
      maxDistance: 12,
    });

    expect(hits.map((hit) => hit.actor.id)).toStrictEqual(['far-circle']);
  });

  it('Excludes the cast actor by default and ignores unsupported segment actors', () => {
    const scene = createScene();
    const { world } = createPhysicsSystem(scene);
    const physicsApi = world.systemApi.get(PhysicsAPI);
    const caster = createCircleActor('caster', 0, 0, 1);
    const segment = createSegmentActor('segment', 0, 5, -1, 0, 1, 0);

    scene.appendChild(caster);
    scene.appendChild(segment);

    const defaultHit = physicsApi.castActor({
      actor: caster,
      direction: new Vector2(1, 0),
      maxDistance: 10,
    });
    const selfHit = physicsApi.castActor({
      actor: caster,
      direction: new Vector2(1, 0),
      maxDistance: 10,
      excludeSelf: false,
    });
    const segmentHit = physicsApi.castActor({
      actor: segment,
      direction: new Vector2(1, 0),
      maxDistance: 10,
    });
    const segmentHits = physicsApi.castActorAll({
      actor: segment,
      direction: new Vector2(1, 0),
      maxDistance: 10,
    });

    expect(defaultHit).toBeNull();
    expect(selfHit?.actor.id).toBe('caster');
    expect(selfHit?.distance).toBe(0);
    expect(segmentHit).toBeNull();
    expect(segmentHits).toStrictEqual([]);
  });
});

import { Vector2 } from '../../../../engine/math-lib';
import { PhysicsAPI } from '../index';
import type { CastHit, OverlapHit } from '../types';

import {
  createBoxActor,
  createCircleActor,
  createPhysicsSystem,
  createScene,
} from './helpers';

describe('Systems -> PhysicsSystem -> Each queries', () => {
  const buildScene = (): PhysicsAPI => {
    const scene = createScene();
    const { world } = createPhysicsSystem(scene);

    ['a', 'b', 'c'].forEach((id, index) => {
      scene.appendChild(createBoxActor(id, 'static', 4 + index * 4, 0));
    });

    return world.systemApi.get(PhysicsAPI);
  };

  it('raycastEach visits every hit', () => {
    const physicsApi = buildScene();
    const visited: string[] = [];

    physicsApi.raycastEach(
      {
        origin: { x: 0, y: 0 },
        direction: new Vector2(1, 0),
        maxDistance: 20,
      },
      (hit) => {
        visited.push(hit.actor.id);
      },
    );

    expect(visited.sort()).toStrictEqual(['a', 'b', 'c']);
  });

  it('raycastEach applies the hit filter', () => {
    const physicsApi = buildScene();
    const visited: string[] = [];

    physicsApi.raycastEach(
      {
        origin: { x: 0, y: 0 },
        direction: new Vector2(1, 0),
        maxDistance: 20,
        hitFilter: (hit): boolean => hit.actor.id !== 'b',
      },
      (hit) => {
        visited.push(hit.actor.id);
      },
    );

    expect(visited.sort()).toStrictEqual(['a', 'c']);
  });

  it('raycastEach reuses a single hit object across callbacks', () => {
    const physicsApi = buildScene();
    const seen = new Set<CastHit>();

    physicsApi.raycastEach(
      {
        origin: { x: 0, y: 0 },
        direction: new Vector2(1, 0),
        maxDistance: 20,
      },
      (hit) => {
        seen.add(hit);
      },
    );

    expect(seen.size).toBe(1);
  });

  it('raycastEach supports nested queries from the callback', () => {
    const physicsApi = buildScene();
    const visited: string[] = [];

    physicsApi.raycastEach(
      {
        origin: { x: 0, y: 0 },
        direction: new Vector2(1, 0),
        maxDistance: 20,
      },
      (hit) => {
        visited.push(hit.actor.id);
        physicsApi.overlapShape({
          shape: { type: 'circle', center: hit.point, radius: 0.1 },
        });
      },
    );

    expect(visited.sort()).toStrictEqual(['a', 'b', 'c']);
  });

  it('raycastEach supports a nested raycastEach from the callback', () => {
    const physicsApi = buildScene();
    const visited: string[] = [];
    const innerVisited: string[] = [];

    physicsApi.raycastEach(
      {
        origin: { x: 0, y: 0 },
        direction: new Vector2(1, 0),
        maxDistance: 20,
      },
      (hit) => {
        visited.push(hit.actor.id);
        physicsApi.raycastEach(
          {
            origin: { x: 3, y: 0 },
            direction: new Vector2(1, 0),
            maxDistance: 2,
          },
          (innerHit) => {
            innerVisited.push(innerHit.actor.id);
          },
        );
      },
    );

    expect(visited.sort()).toStrictEqual(['a', 'b', 'c']);
    expect(innerVisited.length).toBeGreaterThan(0);
  });

  it('overlapEach visits overlapping colliders with a reused hit object', () => {
    const physicsApi = buildScene();
    const visited: string[] = [];
    const seen = new Set<OverlapHit>();

    physicsApi.overlapEach(
      {
        shape: { type: 'box', center: { x: 8, y: 0 }, size: { x: 12, y: 2 } },
      },
      (hit) => {
        visited.push(hit.actor.id);
        seen.add(hit);
      },
    );

    expect(visited.sort()).toStrictEqual(['a', 'b', 'c']);
    expect(seen.size).toBe(1);
  });

  it('shapeCastEach visits every hit along the cast', () => {
    const physicsApi = buildScene();
    const visited: string[] = [];

    physicsApi.shapeCastEach(
      {
        shape: { type: 'circle', center: { x: 0, y: 0 }, radius: 0.5 },
        direction: new Vector2(1, 0),
        maxDistance: 20,
      },
      (hit) => {
        visited.push(hit.actor.id);
      },
    );

    expect(visited.sort()).toStrictEqual(['a', 'b', 'c']);
  });

  it('castActorEach visits every hit along the actor cast, excluding self', () => {
    const scene = createScene();
    const { world } = createPhysicsSystem(scene);
    const physicsApi = world.systemApi.get(PhysicsAPI);
    const caster = createCircleActor('caster', 0, 0, 0.5);
    const targetA = createBoxActor('target-a', 'static', 4, 0);
    const targetB = createBoxActor('target-b', 'static', 8, 0);

    scene.appendChild(caster);
    scene.appendChild(targetA);
    scene.appendChild(targetB);

    const visited: string[] = [];
    const seen = new Set<CastHit>();

    physicsApi.castActorEach(
      {
        actor: caster,
        direction: new Vector2(1, 0),
        maxDistance: 20,
      },
      (hit) => {
        visited.push(hit.actor.id);
        seen.add(hit);
      },
    );

    expect(visited.sort()).toStrictEqual(['target-a', 'target-b']);
    expect(seen.size).toBe(1);
  });

  it('overlapActorEach visits colliders overlapping the actor, excluding self', () => {
    const scene = createScene();
    const { world } = createPhysicsSystem(scene);
    const physicsApi = world.systemApi.get(PhysicsAPI);
    const query = createCircleActor('query', 0, 0, 1);
    const targetA = createCircleActor('target-a', 1.5, 0, 1);
    const targetB = createCircleActor('target-b', -1.5, 0, 1);

    scene.appendChild(query);
    scene.appendChild(targetA);
    scene.appendChild(targetB);

    const visited: string[] = [];
    const seen = new Set<OverlapHit>();

    physicsApi.overlapActorEach({ actor: query }, (hit) => {
      visited.push(hit.actor.id);
      seen.add(hit);
    });

    expect(visited.sort()).toStrictEqual(['target-a', 'target-b']);
    expect(seen.size).toBe(1);
  });
});

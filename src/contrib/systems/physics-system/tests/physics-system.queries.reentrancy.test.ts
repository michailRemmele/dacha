import { Vector2 } from '../../../../engine/math-lib';
import { PhysicsAPI } from '../index';

import { createBoxActor, createPhysicsSystem, createScene } from './helpers';

describe('Systems -> PhysicsSystem -> query reentrancy', () => {
  const buildScene = (): PhysicsAPI => {
    const scene = createScene();
    const { world } = createPhysicsSystem(scene);

    ['a', 'b', 'c'].forEach((id, index) => {
      scene.appendChild(createBoxActor(id, 'static', 4 + index * 4, 0));
    });

    return world.systemApi.get(PhysicsAPI);
  };

  it('returns correct outer results when a hitFilter issues a nested query', () => {
    const physicsApi = buildScene();

    const hits = physicsApi.raycastAll({
      origin: { x: 0, y: 0 },
      direction: new Vector2(1, 0),
      maxDistance: 20,
      hitFilter: (hit): boolean => {
        physicsApi.overlapShape({
          shape: { type: 'circle', center: hit.point, radius: 0.1 },
        });
        return true;
      },
    });

    expect(hits.map((hit) => hit.actor.id)).toStrictEqual(['a', 'b', 'c']);
  });

  it('returns correct outer results when an actorFilter issues a nested query', () => {
    const physicsApi = buildScene();

    const hits = physicsApi.raycastAll({
      origin: { x: 0, y: 0 },
      direction: new Vector2(1, 0),
      maxDistance: 20,
      actorFilter: (): boolean => {
        physicsApi.overlapShape({
          shape: { type: 'circle', center: { x: 100, y: 100 }, radius: 1 },
        });
        return true;
      },
    });

    expect(hits.map((hit) => hit.actor.id)).toStrictEqual(['a', 'b', 'c']);
  });

  it('leaves the subsystem usable after an actorFilter throws', () => {
    const physicsApi = buildScene();

    expect(() =>
      physicsApi.raycastAll({
        origin: { x: 0, y: 0 },
        direction: new Vector2(1, 0),
        maxDistance: 20,
        actorFilter: (): boolean => {
          throw new Error('actorFilter boom');
        },
      }),
    ).toThrow();

    const hits = physicsApi.raycastAll({
      origin: { x: 0, y: 0 },
      direction: new Vector2(1, 0),
      maxDistance: 20,
    });

    expect(hits.map((hit) => hit.actor.id)).toStrictEqual(['a', 'b', 'c']);
  });
});

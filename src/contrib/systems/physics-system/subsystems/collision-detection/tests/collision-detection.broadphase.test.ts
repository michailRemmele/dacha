import type { Scene } from '../../../../../../engine/scene';
import type { SceneSystemOptions } from '../../../../../../engine/system';
import type { PhysicsSettings } from '../../../types';
import { createScene, createBoxActor } from '../../../tests/helpers';
import { CollisionDetectionSubsystem } from '../index';
import type { Contact } from '../types';

const buildSubsystem = (
  scene: Scene,
  settings?: PhysicsSettings,
): CollisionDetectionSubsystem =>
  new CollisionDetectionSubsystem({
    scene,
    globalOptions: settings ? { physics: settings } : {},
  } as unknown as SceneSystemOptions);

const normalizedPairs = (contacts: Contact[]): string[] =>
  contacts.map((contact) =>
    [contact.actor1.id, contact.actor2.id].sort().join('-'),
  );

describe('PhysicsSystem -> Collistion Detection -> broadphase pair generation', () => {
  it('detects exactly the overlapping non-static pairs', () => {
    const scene = createScene();
    scene.appendChild(createBoxActor('a', 'dynamic', 0, 0));
    scene.appendChild(createBoxActor('b', 'dynamic', 1.5, 0));
    scene.appendChild(createBoxActor('c', 'dynamic', 3, 0));

    const contacts = buildSubsystem(scene).update();

    expect(normalizedPairs(contacts).sort()).toStrictEqual(['a-b', 'b-c']);
  });

  it('keeps dynamic-static pairs', () => {
    const scene = createScene();
    scene.appendChild(createBoxActor('ground', 'static', 0, 0));
    scene.appendChild(createBoxActor('box', 'dynamic', 1.5, 0));

    const contacts = buildSubsystem(scene).update();

    expect(normalizedPairs(contacts)).toStrictEqual(['box-ground']);
  });

  it('excludes static-static pairs', () => {
    const scene = createScene();
    scene.appendChild(createBoxActor('s1', 'static', 0, 0));
    scene.appendChild(createBoxActor('s2', 'static', 1.5, 0));

    const contacts = buildSubsystem(scene).update();

    expect(contacts).toHaveLength(0);
  });

  it('respects the collision matrix', () => {
    const settings: PhysicsSettings = {
      collisionLayers: [
        { id: 'red', name: 'red' },
        { id: 'blue', name: 'blue' },
      ],
      collisionMatrix: { red: { blue: false } },
    };
    const scene = createScene();
    scene.appendChild(createBoxActor('r', 'dynamic', 0, 0, { layer: 'red' }));
    scene.appendChild(
      createBoxActor('u', 'dynamic', 1.5, 0, { layer: 'blue' }),
    );

    const contacts = buildSubsystem(scene, settings).update();

    expect(contacts).toHaveLength(0);
  });

  it('produces the same contacts across two identical runs (determinism)', () => {
    const build = (): string[] => {
      const scene = createScene();
      scene.appendChild(createBoxActor('a', 'dynamic', 0, 0));
      scene.appendChild(createBoxActor('b', 'dynamic', 1.5, 0));
      scene.appendChild(createBoxActor('c', 'dynamic', 3, 0));
      return buildSubsystem(scene)
        .update()
        .map((contact) => `${contact.actor1.id}:${contact.actor2.id}`);
    };

    expect(build()).toStrictEqual(build());
  });
});

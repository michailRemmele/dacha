import { Actor } from '../../../../engine/actor';
import { Vector2 } from '../../../../engine/math-lib';
import { RigidBody } from '../../../components';

import { OneWayValidator } from '../one-way-validator';

const createActor = (id: string): Actor => {
  return new Actor({ id, name: id });
};

const createOneWayActor = (id: string): Actor => {
  const actor = createActor(id);

  actor.setComponent(
    new RigidBody({
      type: 'static',
      mass: 1,
      gravityScale: 0,
      linearDamping: 0,
      disabled: false,
      oneWay: true,
      oneWayNormalX: 0,
      oneWayNormalY: -1,
    }),
  );

  return actor;
};

describe('Systems -> CharacterController -> OneWayValidator', () => {
  it('Tracks one-way contacts per character actor', () => {
    const validator = new OneWayValidator();
    const character = createActor('character');
    const oneWayActor = createOneWayActor('platform');

    validator.update();

    expect(
      validator.validate(oneWayActor, character, new Vector2(0, 1)),
    ).toBe(false);
    expect(
      validator.validate(oneWayActor, character, new Vector2(0, -1)),
    ).toBe(false);
  });

  it('Allows blocking-side contacts that were not ignored', () => {
    const validator = new OneWayValidator();
    const character = createActor('character');
    const oneWayActor = createOneWayActor('platform');

    validator.update();

    expect(
      validator.validate(oneWayActor, character, new Vector2(0, -1)),
    ).toBe(true);
  });

  it('Does not clear ignored contacts for untouched character actors', () => {
    const validator = new OneWayValidator();
    const character = createActor('character');
    const oneWayActor = createOneWayActor('platform');

    validator.update();
    validator.validate(oneWayActor, character, new Vector2(0, 1));
    validator.lateUpdate();

    validator.update();
    validator.lateUpdate();

    validator.update();

    expect(
      validator.validate(oneWayActor, character, new Vector2(0, -1)),
    ).toBe(false);
  });

  it('Clears stale ignored contacts for touched character actors', () => {
    const validator = new OneWayValidator();
    const character = createActor('character');
    const oneWayActor = createOneWayActor('platform');

    validator.update();
    validator.validate(oneWayActor, character, new Vector2(0, 1));
    validator.lateUpdate();

    validator.update();
    validator.touch(character);
    validator.lateUpdate();

    validator.update();

    expect(
      validator.validate(oneWayActor, character, new Vector2(0, -1)),
    ).toBe(true);
  });

  it('Deletes ignored contacts for removed character actors', () => {
    const validator = new OneWayValidator();
    const character = createActor('character');
    const oneWayActor = createOneWayActor('platform');

    validator.update();
    validator.validate(oneWayActor, character, new Vector2(0, 1));
    validator.delete(character);

    expect(
      validator.validate(oneWayActor, character, new Vector2(0, -1)),
    ).toBe(true);
  });

  it('Deletes ignored contacts for removed one-way actors', () => {
    const validator = new OneWayValidator();
    const character = createActor('character');
    const oneWayActor = createOneWayActor('platform');

    validator.update();
    validator.validate(oneWayActor, character, new Vector2(0, 1));
    validator.delete(oneWayActor);

    expect(
      validator.validate(oneWayActor, character, new Vector2(0, -1)),
    ).toBe(true);
  });
});

jest.mock('dacha', () => ({
  ...jest.requireActual('../../../../../../dacha/src/engine/reference'),
  ...jest.requireActual('../../../../../../dacha/src/engine/decorators'),
}));

import { DefineComponent, ReferenceWalker } from 'dacha';
import type { ActorConfig, SceneConfig } from 'dacha';

import { copyByPaths } from '../copy-by-paths';
import { runCommand } from '../../tests/run-command';

@DefineComponent({
  name: 'Wire',
  fields: [
    { name: 'door', type: 'actor' },
    { name: 'restart', type: 'scene' },
  ],
})
class Wire {}

const context = { walker: new ReferenceWalker([Wire]) };

const wired = (id: string, config: Record<string, unknown>): ActorConfig => ({
  id,
  name: id,
  children: [],
  components: [{ name: 'Wire', config }],
});

const project = {
  scenes: [
    {
      id: 'level',
      name: 'Level',
      actors: [
        wired('lever', { door: 'door', restart: 'level' }),
        wired('door', { door: '', restart: '' }),
      ],
    },
  ],
  templates: [],
};

const LEVEL_ACTORS = ['scenes', 'id:level', 'actors'];

const wire = (actor: ActorConfig): Record<string, unknown> =>
  actor.components[0].config;

const copyActors = (ids: string[]): ActorConfig[] => {
  const store = runCommand(
    project,
    copyByPaths(
      ids.map((id) => [...LEVEL_ACTORS, `id:${id}`]),
      LEVEL_ACTORS,
    ),
    context,
  );
  return (store.get(LEVEL_ACTORS) as ActorConfig[]).slice(2);
};

describe('scenes copyByPaths', () => {
  it('points the copy of a scene at its own copied actors and at itself', () => {
    const store = runCommand(
      project,
      copyByPaths([['scenes', 'id:level']], ['scenes']),
      context,
    );

    const [original, copy] = store.get(['scenes']) as SceneConfig[];
    const [lever, door] = copy.actors;
    expect(copy.id).not.toBe('level');
    expect(door.id).not.toBe('door');
    expect(wire(lever)).toEqual({ door: door.id, restart: copy.id });
    expect(wire(original.actors[0])).toEqual({
      door: 'door',
      restart: 'level',
    });
  });

  it('points actors copied together at each other', () => {
    const [lever, door] = copyActors(['lever', 'door']);

    expect(door.id).not.toBe('door');
    expect(wire(lever).door).toBe(door.id);
  });

  it('keeps a reference to an actor that was not copied', () => {
    const [lever] = copyActors(['lever']);

    expect(wire(lever).door).toBe('door');
  });
});

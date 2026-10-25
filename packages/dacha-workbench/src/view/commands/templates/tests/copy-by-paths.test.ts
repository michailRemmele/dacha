jest.mock('dacha', () => ({
  ...jest.requireActual('../../../../../../dacha/src/engine/reference'),
  ...jest.requireActual('../../../../../../dacha/src/engine/decorators'),
}));

import { DefineComponent, ReferenceWalker } from 'dacha';
import type { TemplateConfig } from 'dacha';

import { copyByPaths } from '../copy-by-paths';
import { runCommand } from '../../tests/run-command';

@DefineComponent({
  name: 'Spawner',
  fields: [{ name: 'creature', type: 'template' }],
})
class Spawner {}

const context = { walker: new ReferenceWalker([Spawner]) };

const project = {
  templates: [
    {
      id: 'hive',
      name: 'Hive',
      components: [{ name: 'Spawner', config: { creature: 'creature' } }],
      children: [],
    },
    { id: 'creature', name: 'Creature', components: [], children: [] },
  ],
  scenes: [],
};

const copy = (ids: string[]): TemplateConfig[] => {
  const store = runCommand(
    project,
    copyByPaths(
      ids.map((id) => ['templates', `id:${id}`]),
      ['templates'],
    ),
    context,
  );
  return (store.get(['templates']) as TemplateConfig[]).slice(2);
};

const creatureOf = (template: TemplateConfig): unknown =>
  template.components[0].config.creature;

describe('templates copyByPaths', () => {
  it('points a copied hive at the creature copied with it', () => {
    const [hive, creature] = copy(['hive', 'creature']);

    expect(creature.id).not.toBe('creature');
    expect(creatureOf(hive)).toBe(creature.id);
  });

  it('keeps the original creature when only the hive is copied', () => {
    const [hive] = copy(['hive']);

    expect(creatureOf(hive)).toBe('creature');
  });
});

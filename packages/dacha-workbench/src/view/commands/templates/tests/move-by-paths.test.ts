import type { ActorConfig, TemplateConfig } from 'dacha';

import { moveByPaths } from '../move-by-paths';
import { runCommand } from '../../tests/run-command';

const template = (
  id: string,
  children: TemplateConfig[] = [],
): TemplateConfig => ({ id, name: id, components: [], children });

const instance = (
  id: string,
  templateId: string,
  children: ActorConfig[] = [],
): ActorConfig => ({ id, name: id, templateId, components: [], children });

const project = {
  templates: [
    template('enemy', [template('weapon', [template('scope')])]),
    template('boss'),
  ],
  scenes: [
    {
      id: 'level',
      name: 'Level',
      actors: [
        instance('enemy-1', 'enemy', [instance('weapon-1', 'weapon')]),
        instance('boss-1', 'boss'),
        instance('weapon-2', 'weapon'),
      ],
    },
  ],
};

const WEAPON = ['templates', 'id:enemy', 'children', 'id:weapon'];
const BOSS_CHILDREN = ['templates', 'id:boss', 'children'];
const LEVEL = ['scenes', 'id:level', 'actors'];

describe('templates moveByPaths', () => {
  it('moves a template with its children and keeps their ids', () => {
    const store = runCommand(project, moveByPaths([WEAPON], BOSS_CHILDREN));

    expect(store.get(WEAPON)).toBeUndefined();
    expect(
      store.get([...BOSS_CHILDREN, 'id:weapon', 'children', 'id:scope']),
    ).toBeDefined();
  });

  it('moves instances from the old parent instances to the new ones', () => {
    const store = runCommand(project, moveByPaths([WEAPON], BOSS_CHILDREN));

    expect(store.get([...LEVEL, 'id:enemy-1', 'children'])).toEqual([]);
    expect(store.get([...LEVEL, 'id:boss-1', 'children'])).toEqual([
      expect.objectContaining({
        templateId: 'weapon',
        children: [expect.objectContaining({ templateId: 'scope' })],
      }),
    ]);
  });

  it('keeps instances placed on their own', () => {
    const store = runCommand(project, moveByPaths([WEAPON], ['templates']));

    expect(store.get([...LEVEL, 'id:weapon-2'])).toBeDefined();
  });

  it('does not move a template into its own child', () => {
    const store = runCommand(
      project,
      moveByPaths([['templates', 'id:enemy']], [...WEAPON, 'children']),
    );

    expect(store.get(['templates'])).toEqual(project.templates);
  });
});

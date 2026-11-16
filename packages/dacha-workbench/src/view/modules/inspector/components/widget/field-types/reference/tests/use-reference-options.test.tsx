jest.mock('../../../../../../../hooks', () => {
  const { useConfig } = jest.requireActual(
    '../../../../../../../hooks/use-config',
  );
  return { useConfig };
});
jest.mock('../../../../../../../providers', () =>
  jest.requireActual('../../../../../../../providers/command-provider'),
);

import React, { FC, ReactNode } from 'react';
import { renderHook } from '@testing-library/react';

import {
  useAssetOptions,
  useTemplateOptions,
  useActorOptions,
} from '../use-reference-options';
import { CommandContext } from '../../../../../../../providers';
import { CommanderStore } from '../../../../../../../../store';
import type { Data } from '../../../../../../../../store';
import { ROOT_SCOPE } from '../../../../../../../../consts/scopes';

const data = (): Data =>
  ({
    scenes: [
      {
        id: 's1',
        name: 'Level 1',
        actors: [
          {
            id: 'turret',
            name: 'Turret Block',
            components: [],
            children: [
              { id: 'tower', name: 'Tower', components: [], children: [] },
            ],
          },
        ],
      },
      { id: 's2', name: 'Menu', actors: [] },
    ],
    templates: [
      {
        id: 'hive',
        name: 'Hive',
        components: [],
        children: [
          { id: 'hive-core', name: 'Core', components: [], children: [] },
        ],
      },
      { id: 'creature', name: 'Creature', components: [], children: [] },
    ],
    assets: [
      { id: 'tex', name: 'Hero', kind: 'texture', data: {} },
      { id: 'snd', name: 'Jump', kind: 'audio', data: {} },
    ],
  }) as unknown as Data;

const wrapper = (store: CommanderStore): FC<{ children: ReactNode }> =>
  function Wrapper({ children }) {
    const context = React.useMemo(
      () => ({
        store,
        activeScope: ROOT_SCOPE,
        setActiveScope: (): void => void 0,
      }),
      [],
    );
    return (
      <CommandContext.Provider value={context}>
        {children}
      </CommandContext.Provider>
    );
  };

const run = <T,>(hook: () => T): T =>
  renderHook(hook, { wrapper: wrapper(new CommanderStore(data())) }).result
    .current;

const SCENE_PATH = ['scenes', 'id:s1', 'actors', 'id:turret', 'components'];
const TEMPLATE_PATH = ['templates', 'id:hive', 'components'];

describe('reference options', () => {
  it('lists root templates only', () => {
    expect(run(() => useTemplateOptions()).options).toEqual([
      { title: 'Hive', value: 'hive' },
      { title: 'Creature', value: 'creature' },
    ]);
  });

  it('lists the actors of the scene being edited with their parent path', () => {
    expect(run(() => useActorOptions(SCENE_PATH))).toEqual({
      available: true,
      options: [
        { title: 'Turret Block', value: 'turret' },
        { title: 'Turret Block / Tower', value: 'tower' },
      ],
    });
  });

  it('offers no actors outside a scene', () => {
    expect(run(() => useActorOptions(TEMPLATE_PATH))).toEqual({
      available: false,
      options: [],
    });
  });

  it('lists assets of the matching kind only', () => {
    expect(run(() => useAssetOptions('texture')).options).toEqual([
      { title: 'Hero', value: 'tex' },
    ]);
  });
});

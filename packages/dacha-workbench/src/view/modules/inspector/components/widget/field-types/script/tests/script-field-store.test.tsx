const mockSchemas: Record<string, unknown> = {};

jest.mock('../../../../../../../hooks', () => {
  const { useConfig } = jest.requireActual(
    '../../../../../../../hooks/use-config',
  );
  const { useCommander } = jest.requireActual(
    '../../../../../../../hooks/use-commander',
  );
  return { useConfig, useCommander, useSchemas: (): unknown => mockSchemas };
});
jest.mock('../../../../../../../providers', () =>
  jest.requireActual('../../../../../../../providers/command-provider'),
);
jest.mock('../..', () => ({
  fieldTypes: {
    script: jest.requireActual('..').ScriptField,
  },
}));
jest.mock('../../..', () => ({ Widget: (): null => null }));
jest.mock('../../../../custom-widget', () => ({
  CustomWidget: (): null => null,
}));
jest.mock('../../../../section', () => ({
  Section: (props: { children: React.ReactNode }): React.ReactElement => (
    <div>{props.children}</div>
  ),
}));
jest.mock('../../../../entity-picker', () => ({
  EntitySelect: (props: {
    onAdd: (value: string | null) => void;
  }): React.ReactElement => (
    <button onClick={(): void => props.onAdd(null)}>pick none</button>
  ),
  EntityMultiselect: (props: {
    onAdd: (value: string) => void;
  }): React.ReactElement => (
    <button onClick={(): void => props.onAdd('Wave')}>add Wave</button>
  ),
}));
jest.mock('../../../../../../../../utils/uuid', () => ({
  uuid: (): string => 'new-id',
}));

import React, { FC, ReactElement } from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import { Field } from '../../../../field';
import { CommandContext } from '../../../../../../../providers';
import { CommanderStore } from '../../../../../../../../store';
import type { Data } from '../../../../../../../../store';
import { ROOT_SCOPE } from '../../../../../../../../consts/scopes';

const Harness: FC<{ store: CommanderStore; children: ReactElement }> = ({
  store,
  children,
}) => {
  const context = React.useMemo(
    () => ({
      store,
      activeScope: ROOT_SCOPE,
      setActiveScope: (): void => void 0,
    }),
    [store],
  );
  return (
    <CommandContext.Provider value={context}>
      {children}
    </CommandContext.Provider>
  );
};

beforeEach(() => {
  Object.keys(mockSchemas).forEach((key) => delete mockSchemas[key]);
  Object.assign(mockSchemas, {
    Patrol: { fields: [{ name: 'speed', type: 'number', initialValue: 1 }] },
    Wave: { fields: [] },
  });
  Object.defineProperty(window, 'electron', {
    writable: true,
    value: {
      getEditorConfig: () => ({ formatWidgetNames: true }),
      createBehavior: jest.fn(),
    },
  });
});

describe('ScriptField through Field and the store', () => {
  it('keeps an option edited inside an entry when the list changes', () => {
    const store = new CommanderStore({
      actor: { list: [{ id: 'b1', name: 'Patrol', options: { speed: 1 } }] },
    } as Data);
    render(
      <Harness store={store}>
        <Field
          name="list"
          type="script"
          kind="behavior"
          multiple
          path={['actor']}
        />
      </Harness>,
    );

    act(() => {
      store.assign(['actor', 'list', 'id:b1', 'options', 'speed'], 5);
    });
    fireEvent.click(screen.getByText('add Wave'));

    expect(store.get(['actor', 'list'])).toEqual([
      { id: 'b1', name: 'Patrol', options: { speed: 5 } },
      { id: 'new-id', name: 'Wave', options: {} },
    ]);
  });

  it('clears a single field', () => {
    const store = new CommanderStore({
      mesh: { material: { name: 'Patrol', options: {} } },
    } as Data);
    render(
      <Harness store={store}>
        <Field name="material" type="script" kind="shader" path={['mesh']} />
      </Harness>,
    );

    fireEvent.click(screen.getByText('pick none'));

    expect(store.get(['mesh', 'material'])).toBeUndefined();
  });
});

jest.mock('../../../../../hooks', () => {
  const { useConfig } = jest.requireActual('../../../../../hooks/use-config');
  const { useCommander } = jest.requireActual(
    '../../../../../hooks/use-commander',
  );
  return { useConfig, useCommander };
});

jest.mock('../../../../../providers', () =>
  jest.requireActual('../../../../../providers/command-provider'),
);

import React, { FC } from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import type { Field as FieldSchema } from 'dacha';

import { Field } from '../../field';
import { CommandContext } from '../../../../../providers';
import { CommanderStore } from '../../../../../../store';
import type { Data } from '../../../../../../store';
import { ROOT_SCOPE } from '../../../../../../consts/scopes';

jest.mock('../../widget/field-types', () => {
  const StubInput: FC<{
    value: unknown;
    label: string;
    onChange?: (value: unknown) => void;
    onAccept?: () => void;
    onBlur?: () => void;
  }> = ({
    value,
    label,
    onChange = (): void => void 0,
    onAccept = (): void => void 0,
    onBlur = (): void => void 0,
  }) => (
    <input
      aria-label={label}
      value={value === undefined || value === null ? '' : String(value)}
      onChange={(event): void => onChange(event.target.value)}
      onBlur={(): void => {
        onAccept();
        onBlur();
      }}
    />
  );

  return {
    fieldTypes: {
      string: StubInput,
      number: StubInput,
      script: ({ label }: { label: string }): React.ReactElement => (
        <div data-testid="script-field">{label}</div>
      ),
    },
  };
});

const buildFields = (): FieldSchema[] => [
  {
    name: 'mode',
    type: 'string',
    title: 'Mode',
    initialValue: 'a',
  },
  {
    name: 'extra',
    type: 'number',
    title: 'Extra',
    initialValue: 5,
    dependency: { name: 'mode', value: 'b' },
  },
  {
    name: 'blob',
    type: 'data',
    initialValue: [],
  },
  {
    name: 'effects',
    type: 'script',
    title: 'Effects',
    kind: 'filterEffect',
    multiple: true,
    dependency: { name: 'mode', value: 'b' },
  },
];

const Harness: FC<{ store: CommanderStore }> = ({ store }) => {
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
      {buildFields().map((field) => (
        <Field key={field.name} {...field} path={['collider']} />
      ))}
    </CommandContext.Provider>
  );
};

const createStore = (): CommanderStore => {
  const data: Data = {
    collider: {
      mode: 'a',
    },
  };
  return new CommanderStore(data);
};

describe('Field + DependencyField', () => {
  it('does not render data fields', () => {
    const store = createStore();
    render(<Harness store={store} />);

    expect(screen.queryByLabelText('Blob')).toBeNull();
    expect(screen.getAllByRole('textbox')).toHaveLength(1);
  });

  it('fills initialValue when a dependency field becomes visible', () => {
    const store = createStore();
    render(<Harness store={store} />);

    expect(screen.queryByLabelText('Extra')).toBeNull();

    const modeInput = screen.getByLabelText('Mode');
    fireEvent.change(modeInput, { target: { value: 'b' } });
    fireEvent.blur(modeInput);

    const extraInput = screen.getByLabelText('Extra') as HTMLInputElement;
    expect(extraInput.value).toBe('5');
    expect(store.get(['collider', 'extra'])).toBe(5);
  });

  it('shows a script field only while its dependency holds', () => {
    const store = createStore();
    render(<Harness store={store} />);

    expect(screen.queryByTestId('script-field')).toBeNull();

    const modeInput = screen.getByLabelText('Mode');
    fireEvent.change(modeInput, { target: { value: 'b' } });
    fireEvent.blur(modeInput);

    expect(screen.getByTestId('script-field')).toHaveTextContent('Effects');
    expect(store.get(['collider', 'effects'])).toEqual([]);

    fireEvent.change(modeInput, { target: { value: 'a' } });
    fireEvent.blur(modeInput);

    expect(screen.queryByTestId('script-field')).toBeNull();
    expect(store.get(['collider', 'effects'])).toBeUndefined();
  });

  it('groups the fill with the triggering change for undo', () => {
    const store = createStore();
    render(<Harness store={store} />);

    const modeInput = screen.getByLabelText('Mode');
    fireEvent.change(modeInput, { target: { value: 'b' } });
    fireEvent.blur(modeInput);

    expect(store.get(['collider', 'mode'])).toBe('b');
    expect(store.get(['collider', 'extra'])).toBe(5);

    act(() => {
      store.undo({ scope: ROOT_SCOPE });
    });

    expect(store.get(['collider', 'mode'])).toBe('a');
    expect(store.get(['collider', 'extra'])).toBeUndefined();
  });
});

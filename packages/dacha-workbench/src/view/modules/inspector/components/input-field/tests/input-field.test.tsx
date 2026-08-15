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
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

import { InputField } from '..';
import { NumberInput } from '../../number-input';
import { fieldValueValidators } from '../../widget/field-value-validators';
import { CommandContext } from '../../../../../providers';
import { CommanderStore } from '../../../../../../store';
import type { Data } from '../../../../../../store';
import { ROOT_SCOPE } from '../../../../../../consts/scopes';

const isFiniteNumber = (value: unknown): boolean =>
  typeof value === 'number' && Number.isFinite(value);

const Harness: FC<{
  store: CommanderStore;
  validate?: (value: unknown) => boolean;
}> = ({ store, validate }) => {
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
      <InputField
        path={['collider', 'radius']}
        component={NumberInput}
        validate={validate}
      />
    </CommandContext.Provider>
  );
};

const createStore = (): CommanderStore => {
  const data: Data = {
    collider: {
      radius: 5,
    },
  };
  return new CommanderStore(data);
};

describe('InputField', () => {
  it('reverts to the committed value when input is cleared and blurred', () => {
    const store = createStore();
    const dispatchSpy = jest.spyOn(store, 'dispatch');

    render(<Harness store={store} validate={isFiniteNumber} />);

    const input = screen.getByRole('spinbutton') as HTMLInputElement;
    expect(input.value).toBe('5');

    fireEvent.change(input, { target: { value: '' } });
    fireEvent.blur(input);

    expect(input.value).toBe('5');
    expect(store.get(['collider', 'radius'])).toBe(5);
    expect(dispatchSpy).not.toHaveBeenCalled();

    store.undo({ scope: ROOT_SCOPE });
    expect(store.get(['collider', 'radius'])).toBe(5);
  });

  it('commits normally for a valid new value', () => {
    const store = createStore();

    render(<Harness store={store} validate={isFiniteNumber} />);

    const input = screen.getByRole('spinbutton') as HTMLInputElement;

    fireEvent.change(input, { target: { value: '7' } });
    fireEvent.blur(input);

    expect(input.value).toBe('7');
    expect(store.get(['collider', 'radius'])).toBe(7);
  });

  it('commits null when no validator is wired, which is why call sites must pass one', () => {
    const store = createStore();

    render(<Harness store={store} />);

    const input = screen.getByRole('spinbutton') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.blur(input);

    expect(store.get(['collider', 'radius'])).toBeNull();
  });

  it('reverts instead of committing null when wired with the shared fieldValueValidators', () => {
    const store = createStore();

    render(<Harness store={store} validate={fieldValueValidators.number} />);

    const input = screen.getByRole('spinbutton') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.blur(input);

    expect(store.get(['collider', 'radius'])).toBe(5);
  });
});

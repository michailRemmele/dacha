// The full `hooks`/`providers` barrels transitively import `useExtension` /
// `EngineProvider`, which pull in the `dacha` engine package (ESM, not
// transformable by ts-jest). Field only touches useConfig/useCommander, so we
// replace those two barrels with slim re-exports of only the real, untouched
// implementations it actually needs (useConfig/useCommander,
// CommandContext/CommandScopeContext) — no behavior is faked, we just avoid
// loading unrelated modules that happen to sit in the same barrel file.
jest.mock('../../../../../hooks', () => {
  const { useConfig } = jest.requireActual('../../../../../hooks/use-config')
  const { useCommander } = jest.requireActual('../../../../../hooks/use-commander')
  return { useConfig, useCommander }
})

jest.mock(
  '../../../../../providers',
  () => jest.requireActual('../../../../../providers/command-provider'),
)

import React, { FC } from 'react'
import {
  render, screen, fireEvent,
} from '@testing-library/react'
import '@testing-library/jest-dom'

import { Field } from '..'
import { NumberInput } from '../../number-input'
import { fieldValueValidators } from '../../widget/field-value-validators'
import { CommandContext } from '../../../../../providers'
import { CommanderStore } from '../../../../../../store'
import type { Data } from '../../../../../../store'
import { ROOT_SCOPE } from '../../../../../../consts/scopes'

const isFiniteNumber = (value: unknown): boolean => typeof value === 'number' && Number.isFinite(value)

const Harness: FC<{ store: CommanderStore, isValueValid?: (value: unknown) => boolean }> = ({
  store,
  isValueValid,
}) => {
  const context = React.useMemo(() => ({
    store,
    activeScope: ROOT_SCOPE,
    setActiveScope: (): void => void 0,
  }), [store])

  return (
    <CommandContext.Provider value={context}>
      <Field
        path={['collider', 'radius']}
        component={NumberInput}
        isValueValid={isValueValid}
      />
    </CommandContext.Provider>
  )
}

const createStore = (): CommanderStore => {
  const data: Data = {
    collider: {
      radius: 5,
    },
  }
  return new CommanderStore(data)
}

describe('Field', () => {
  it('reverts to the committed value when input is cleared and blurred', () => {
    const store = createStore()
    const dispatchSpy = jest.spyOn(store, 'dispatch')

    render(<Harness store={store} isValueValid={isFiniteNumber} />)

    const input = screen.getByRole('spinbutton') as HTMLInputElement
    expect(input.value).toBe('5')

    // antd's InputNumber emits onChange(null) when the field is cleared
    fireEvent.change(input, { target: { value: '' } })
    fireEvent.blur(input)

    expect(input.value).toBe('5')
    expect(store.get(['collider', 'radius'])).toBe(5)
    // reverting must not dispatch a command, so nothing enters undo history
    expect(dispatchSpy).not.toHaveBeenCalled()

    // undo must be a no-op: there is nothing to undo for this field
    store.undo({ scope: ROOT_SCOPE })
    expect(store.get(['collider', 'radius'])).toBe(5)
  })

  it('commits normally for a valid new value', () => {
    const store = createStore()

    render(<Harness store={store} isValueValid={isFiniteNumber} />)

    const input = screen.getByRole('spinbutton') as HTMLInputElement

    fireEvent.change(input, { target: { value: '7' } })
    fireEvent.blur(input)

    expect(input.value).toBe('7')
    expect(store.get(['collider', 'radius'])).toBe(7)
  })

  /*
   * Hand-written Fields (project settings, the animatable editor, mouse-control) are not
   * rendered through WidgetField, so they only get a validator if their call site passes one.
   * Without it a cleared input commits null — and since reconciliation only fills `undefined`,
   * null is treated as present and never healed, leaving the field permanently empty.
   */
  it('commits null when no validator is wired, which is why call sites must pass one', () => {
    const store = createStore()

    render(<Harness store={store} />)

    const input = screen.getByRole('spinbutton') as HTMLInputElement
    fireEvent.change(input, { target: { value: '' } })
    fireEvent.blur(input)

    expect(store.get(['collider', 'radius'])).toBeNull()
  })

  it('reverts instead of committing null when wired with the shared fieldValueValidators', () => {
    const store = createStore()

    render(<Harness store={store} isValueValid={fieldValueValidators.number} />)

    const input = screen.getByRole('spinbutton') as HTMLInputElement
    fireEvent.change(input, { target: { value: '' } })
    fireEvent.blur(input)

    expect(store.get(['collider', 'radius'])).toBe(5)
  })
})

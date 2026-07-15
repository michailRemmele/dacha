// The full `hooks`/`providers` barrels transitively import `useExtension` /
// `EngineProvider`, which pull in the `dacha` engine package (ESM, not
// transformable by ts-jest). Neither WidgetField nor DependencyField touch the
// engine, so we replace those two barrels with slim re-exports of only the
// real, untouched implementations they actually need (useConfig/useCommander,
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
  render, screen, fireEvent, act,
} from '@testing-library/react'
import '@testing-library/jest-dom'

import { WidgetField } from '../../widget/widget-field'
import { CommandContext } from '../../../../../providers'
import { CommanderStore } from '../../../../../../store'
import type { Data } from '../../../../../../store'
import { ROOT_SCOPE } from '../../../../../../consts/scopes'
import type { Field } from '../../../../../../types/widget-schema'

// The real field-type components are antd-backed and heavy to drive in jsdom.
// WidgetField/DependencyField only care about *which* component gets a value,
// not how that component renders it, so we swap the lookup table for plain
// native inputs that expose the same (value, onChange, onAccept, onBlur, label) contract.
jest.mock('../../widget/field-types', () => {
  const StubInput: FC<{
    value: unknown
    label: string
    onChange?: (value: unknown) => void
    onAccept?: () => void
    onBlur?: () => void
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
        onAccept()
        onBlur()
      }}
    />
  )

  return {
    fieldTypes: {
      string: StubInput,
      number: StubInput,
    },
  }
})

const buildFields = (): Field[] => [
  {
    name: 'mode', type: 'string', title: 'Mode', initialValue: 'a',
  },
  {
    name: 'extra',
    type: 'number',
    title: 'Extra',
    initialValue: 5,
    dependency: { name: 'mode', value: 'b' },
  },
  {
    name: 'blob', type: 'data', initialValue: [],
  },
]

const Harness: FC<{ store: CommanderStore }> = ({ store }) => {
  const context = React.useMemo(() => ({
    store,
    activeScope: ROOT_SCOPE,
    setActiveScope: (): void => void 0,
  }), [store])

  return (
    <CommandContext.Provider value={context}>
      {buildFields().map((field) => (
        <WidgetField key={field.name} field={field} path={['collider']} />
      ))}
    </CommandContext.Provider>
  )
}

const createStore = (): CommanderStore => {
  const data: Data = {
    collider: {
      mode: 'a',
    },
  }
  return new CommanderStore(data)
}

describe('WidgetField + DependencyField', () => {
  it('does not render data fields', () => {
    const store = createStore()
    render(<Harness store={store} />)

    expect(screen.queryByLabelText('Blob')).toBeNull()
    // only 'mode' is rendered up front: 'extra' is hidden by its dependency,
    // and 'blob' is a data field skipped entirely by the generic renderer.
    expect(screen.getAllByRole('textbox')).toHaveLength(1)
  })

  it('fills initialValue when a dependency field becomes visible', () => {
    const store = createStore()
    render(<Harness store={store} />)

    expect(screen.queryByLabelText('Extra')).toBeNull()

    const modeInput = screen.getByLabelText('Mode')
    fireEvent.change(modeInput, { target: { value: 'b' } })
    fireEvent.blur(modeInput)

    const extraInput = screen.getByLabelText('Extra') as HTMLInputElement
    expect(extraInput.value).toBe('5')
    expect(store.get(['collider', 'extra'])).toBe(5)
  })

  it('groups the fill with the triggering change for undo', () => {
    const store = createStore()
    render(<Harness store={store} />)

    const modeInput = screen.getByLabelText('Mode')
    fireEvent.change(modeInput, { target: { value: 'b' } })
    fireEvent.blur(modeInput)

    expect(store.get(['collider', 'mode'])).toBe('b')
    expect(store.get(['collider', 'extra'])).toBe(5)

    act(() => {
      store.undo({ scope: ROOT_SCOPE })
    })

    // A single undo must revert BOTH the user's change (mode) and the
    // effect it triggered (the fill of 'extra'). If the fill were dispatched
    // without isEffect:true, it would land in its own history entry and this
    // one undo would only revert 'mode', leaving 'extra' at 5.
    expect(store.get(['collider', 'mode'])).toBe('a')
    expect(store.get(['collider', 'extra'])).toBeUndefined()
  })
})

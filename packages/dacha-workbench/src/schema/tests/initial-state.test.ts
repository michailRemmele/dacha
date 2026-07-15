import type { Field } from '../../types/widget-schema'

import { resolveFieldInitialValue, buildInitialState, fillMissingFields } from '..'

describe('resolveFieldInitialValue', () => {
  it('returns explicit initialValue when set', () => {
    expect(resolveFieldInitialValue({ name: 'x', type: 'number', initialValue: 5 })).toBe(5)
  })

  it('falls back to type default when initialValue is absent', () => {
    expect(resolveFieldInitialValue({ name: 'x', type: 'number' })).toBe(0)
    expect(resolveFieldInitialValue({ name: 'x', type: 'string' })).toBe('')
    expect(resolveFieldInitialValue({ name: 'x', type: 'boolean' })).toBe(false)
    expect(resolveFieldInitialValue({ name: 'x', type: 'color' })).toBe('#ffffff')
    expect(resolveFieldInitialValue({ name: 'x', type: 'multitext' })).toEqual([])
  })

  it('deep-clones object initial values', () => {
    const initialValue = { nested: [1, 2] }
    const field: Field = { name: 'x', type: 'data', initialValue }
    const first = resolveFieldInitialValue(field)
    const second = resolveFieldInitialValue(field)
    expect(first).toEqual(initialValue)
    expect(first).not.toBe(initialValue)
    expect(first).not.toBe(second)
  })
})

describe('buildInitialState', () => {
  const colliderLikeFields: Field[] = [
    { name: 'type', type: 'select', initialValue: 'box', options: ['box', 'circle'] },
    { name: 'sizeX', type: 'number', initialValue: 1, dependency: { name: 'type', value: 'box' } },
    { name: 'radius', type: 'number', initialValue: 1, dependency: { name: 'type', value: 'circle' } },
    { name: 'disabled', type: 'boolean', initialValue: false },
  ]

  it('fills plain fields and only dependency fields whose condition is met', () => {
    expect(buildInitialState(colliderLikeFields)).toEqual({
      type: 'box',
      sizeX: 1,
      disabled: false,
    })
  })

  it('resolves dependency chains in declaration order', () => {
    const fields: Field[] = [
      { name: 'a', type: 'boolean', initialValue: true },
      { name: 'b', type: 'boolean', initialValue: true, dependency: { name: 'a', value: true } },
      { name: 'c', type: 'number', initialValue: 7, dependency: { name: 'b', value: true } },
    ]
    expect(buildInitialState(fields)).toEqual({ a: true, b: true, c: 7 })
  })
})

describe('fillMissingFields', () => {
  const fields: Field[] = [
    { name: 'zoom', type: 'number', initialValue: 1 },
    { name: 'current', type: 'boolean', initialValue: false },
  ]

  it('fills only missing keys and preserves existing values', () => {
    const state = { zoom: 3 }
    const result = fillMissingFields(state, fields)
    expect(result).toEqual({ zoom: 3, current: false })
    expect(result).not.toBe(state)
  })

  it('returns the same reference when nothing is missing', () => {
    const state = { zoom: 3, current: true }
    expect(fillMissingFields(state, fields)).toBe(state)
  })

  it('supports dot-path dependency names', () => {
    const depFields: Field[] = [
      { name: 'flag', type: 'string', initialValue: 'on', dependency: { name: 'nested.mode', value: 'on' } },
    ]
    expect(fillMissingFields({ nested: { mode: 'on' } }, depFields))
      .toEqual({ nested: { mode: 'on' }, flag: 'on' })
    const off = { nested: { mode: 'off' } }
    expect(fillMissingFields(off, depFields)).toBe(off)
  })
})

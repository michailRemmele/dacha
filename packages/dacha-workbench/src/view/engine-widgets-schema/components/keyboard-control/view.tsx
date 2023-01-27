import React, {
  useMemo,
  useCallback,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'antd'

import type { WidgetProps } from '../../../../types/widget-schema'
import { useConfig, useCommander } from '../../../hooks'
import { addValue } from '../../../commands'

import { keys } from './keys'
import { RELEASED, PRESSED } from './events'
import { InputBind } from './input-bind'
import { capitalize } from './utils'

import './style.less'

export interface EventOption {
  title: string
  value: string
}

export interface InputEventBind {
  event: string
  messageType: string
  attrs: Record<string, unknown>
}

export type InputEventBindings = Record<string, Omit<InputEventBind, 'event'>>

export const KeyboardControlWidget: FC<WidgetProps> = ({ path }) => {
  const { t } = useTranslation()
  const { dispatch } = useCommander()

  const bindingsPath = useMemo(() => path.concat('inputEventBindings'), [path])
  const inputEventBindings = useConfig(bindingsPath) as Array<InputEventBind>

  const inputKeys = useMemo(() => keys.map((key) => ({
    title: capitalize(key),
    value: key,
  }), []), [])
  const bindingsMap = useMemo(
    () => inputEventBindings.reduce((acc: InputEventBindings, { event, ...bind }) => {
      acc[event] = bind
      return acc
    }, {}),
    [inputEventBindings],
  )

  const availableKeys = useMemo(
    () => inputKeys.filter(
      (event) => !bindingsMap[`${event.value}_${PRESSED}`] || !bindingsMap[`${event.value}_${RELEASED}`],
    ),
    [bindingsMap, inputKeys],
  )

  const addedKeys = useMemo(() => inputEventBindings.map((bindKey) => {
    const [key, event] = bindKey.event.split('_')
    return {
      key,
      event,
    }
  }), [inputEventBindings])

  const handleAddNewBind = useCallback(() => {
    const key = availableKeys[0].value
    const event = !bindingsMap[`${key}_${PRESSED}`] ? PRESSED : RELEASED

    dispatch(addValue(bindingsPath, { event: `${key}_${event}`, messageType: '', attrs: {} }))
  }, [dispatch, bindingsPath, availableKeys, bindingsMap])

  return (
    <div>
      <ul className="keyboard-control__events">
        {addedKeys.map(({ key, event }, index) => (
          <li className="keyboard-control__fieldset" key={`${key}_${event}`}>
            <InputBind
              path={path}
              inputKey={key}
              inputEvent={event}
              order={index}
              availableKeys={availableKeys}
            />
          </li>
        ))}
      </ul>
      <Button
        className="keyboard-control__button"
        size="small"
        onClick={handleAddNewBind}
        disabled={availableKeys.length === 0}
      >
        {t('components.keyboardControl.bind.addNew.title')}
      </Button>
    </div>
  )
}

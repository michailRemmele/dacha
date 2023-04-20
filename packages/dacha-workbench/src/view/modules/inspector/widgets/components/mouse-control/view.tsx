import React, {
  useMemo,
  useCallback,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'antd'

import type { WidgetProps } from '../../../../../../types/widget-schema'
import { useConfig, useCommander } from '../../../../../hooks'
import { addValue } from '../../../../../commands'

import { events } from './events'
import { InputBind } from './input-bind'

import './style.less'

export interface EventOption {
  title: string
  value: string
}

export interface InputEventBind {
  event: string
}

export type InputEventBindings = Record<string, Omit<InputEventBind, 'event'>>

export const MouseControlWidget: FC<WidgetProps> = ({ path }) => {
  const { t } = useTranslation()
  const { dispatch } = useCommander()

  const bindingsPath = useMemo(() => path.concat('inputEventBindings'), [path])
  const inputEventBindings = useConfig(bindingsPath) as Array<InputEventBind>

  const options = useMemo(() => events.map(({ title, value }) => ({
    title: t(title),
    value,
  })), [])
  const optionsMap = useMemo(() => options.reduce((acc: Record<string, EventOption>, option) => {
    acc[option.value] = option
    return acc
  }, {}), [options])
  const bindingsMap = useMemo(
    () => inputEventBindings.reduce((acc: InputEventBindings, { event, ...bind }) => {
      acc[event] = bind
      return acc
    }, {}),
    [inputEventBindings],
  )
  const availableOptions = useMemo(
    () => options.filter((event) => !bindingsMap[event.value]),
    [bindingsMap, options],
  )
  const addedOptions = useMemo(
    () => inputEventBindings.map((bind) => optionsMap[bind.event]),
    [inputEventBindings, optionsMap],
  )

  const handleAddNewBind = useCallback(() => {
    const inputEvent = availableOptions[0].value
    dispatch(addValue(bindingsPath, { event: inputEvent, messageType: '', attrs: [] }))
  }, [dispatch, bindingsPath, availableOptions])

  return (
    <div>
      <ul className="mouse-control__events">
        {addedOptions.map((event, index) => (
          <li className="mouse-control__fieldset" key={event.value}>
            <InputBind
              path={path}
              event={event}
              order={index}
              availableEvents={availableOptions}
            />
          </li>
        ))}
      </ul>
      <Button
        className="mouse-control__button"
        size="small"
        onClick={handleAddNewBind}
        disabled={availableOptions.length === 0}
      >
        {t('components.mouseControl.bind.addNew.title')}
      </Button>
    </div>
  )
}

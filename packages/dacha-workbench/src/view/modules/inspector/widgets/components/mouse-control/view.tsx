import {
  useMemo,
  useCallback,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'antd'
import { v4 as uuidv4 } from 'uuid'

import type { WidgetProps } from '../../../../../../types/widget-schema'
import { useConfig, useCommander } from '../../../../../hooks'
import { addValue } from '../../../../../commands'

import { InputBind } from './input-bind'

import {
  EventListStyled,
  ButtonCSS,
} from './mouse-control.style'

export interface EventOption {
  title: string
  value: string
}

export interface InputEventBind {
  id: string
  event: string
  button?: number
  eventType: string
  attrs: unknown[]
}

export type InputEventBindings = Record<string, Omit<InputEventBind, 'event'>>

const options = [
  'mousedown',
  'mouseup',
  'mousemove',
  'click',
  'contextmenu',
  'dblclick',
  'mouseenter',
  'mouseleave',
].map((value) => ({ title: value, value }))

export const MouseControlWidget: FC<WidgetProps> = ({ path }) => {
  const { t } = useTranslation()
  const { dispatch } = useCommander()

  const bindingsPath = useMemo(() => path.concat('inputEventBindings'), [path])
  const inputEventBindings = useConfig(bindingsPath) as InputEventBind[]

  const selectedOptions = useMemo(
    () => inputEventBindings.map((inputEventBinding) => inputEventBinding.event),
    [inputEventBindings],
  )

  const handleAddNewBind = useCallback(() => {
    const inputEvent = options.find(
      (option) => !selectedOptions.includes(option.value),
    )?.value as string

    const inputBind: InputEventBind = {
      id: uuidv4(),
      event: inputEvent,
      eventType: '',
      attrs: [],
    }
    if (inputEvent === 'mousedown' || inputEvent === 'mouseup') {
      inputBind.button = 0
    }
    dispatch(addValue(bindingsPath, inputBind))
  }, [dispatch, bindingsPath, selectedOptions, options])

  return (
    <div>
      <EventListStyled>
        {inputEventBindings.map((inputEventBind, index) => (
          <li key={inputEventBind.id}>
            <InputBind
              path={path}
              value={inputEventBind.event}
              order={index}
              options={options}
              selectedOptions={selectedOptions}
            />
          </li>
        ))}
      </EventListStyled>
      <Button
        css={ButtonCSS}
        size="small"
        onClick={handleAddNewBind}
        disabled={selectedOptions.length === options.length}
      >
        {t('components.mouseControl.bind.addNew.title')}
      </Button>
    </div>
  )
}

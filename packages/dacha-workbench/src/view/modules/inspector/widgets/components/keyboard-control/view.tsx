import React, {
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

import { keys } from './keys'
import { RELEASED, PRESSED } from './events'
import { InputBind } from './input-bind'
import { capitalize } from './utils'

import type { InputEventBind, InputEventBindings } from './types'

import './style.less'

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
    () => inputEventBindings.reduce((acc: InputEventBindings, { event, key, ...bind }) => {
      acc[`${key}_${event}`] = bind
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

  const addedKeys = useMemo(() => inputEventBindings.map((inputBind) => ({
    id: inputBind.id,
    key: inputBind.key,
    event: inputBind.event,
  })), [inputEventBindings])

  const handleAddNewBind = useCallback(() => {
    const key = availableKeys[0].value
    const event = !bindingsMap[`${key}_${PRESSED}`] ? PRESSED : RELEASED

    dispatch(addValue(bindingsPath, {
      id: uuidv4(),
      key,
      event,
      messageType: '',
      attrs: [],
    }))
  }, [dispatch, bindingsPath, availableKeys, bindingsMap])

  return (
    <div>
      <ul className="keyboard-control__events">
        {addedKeys.map(({ id, key, event }, index) => (
          <li className="keyboard-control__fieldset" key={id}>
            <InputBind
              path={path}
              id={id}
              inputKey={key}
              inputEvent={event}
              order={index}
              availableKeys={availableKeys}
              bindingsMap={bindingsMap}
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

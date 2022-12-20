import React, {
  useContext,
  useMemo,
  useCallback,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'antd'

import type { WidgetProps } from '../../../../types/widget-schema'
import type { Data } from '../../../utils/get'
import { get } from '../../../utils/get'
import { EngineContext } from '../../../providers'

import { keys } from './keys'
import { InputBind } from './input-bind'
import { capitalize } from './utils'

import './style.less'

export interface InputEventBindings {
  [key: string]: {
    messageType: string
    attrs: Record<string, unknown>
  }
}

export const KeyboardControlWidget: FC<WidgetProps> = ({ path }) => {
  const { t } = useTranslation()

  const { sceneContext } = useContext(EngineContext)
  const projectConfig = sceneContext.data.projectConfig as Data

  const inputKeys = useMemo(() => keys.map((key) => ({
    title: capitalize(key),
    value: key,
  }), []), [])

  const inputEventBindings = useMemo(
    () => get(projectConfig, path.concat('inputEventBindings')) as InputEventBindings,
    [projectConfig],
  )

  const availableKeys = useMemo(
    () => inputKeys.filter(
      (event) => !inputEventBindings[`${event.value}_PRESSED`] || !inputEventBindings[`${event.value}_RELEASED`],
    ),
    [inputEventBindings, inputKeys],
  )

  const addedKeys = useMemo(() => Object.keys(inputEventBindings).map((bindKey) => {
    const [key, event] = bindKey.split('_')
    return {
      key,
      event,
    }
  }), [inputEventBindings])

  const handleAddNewBind = useCallback(() => {
    // TODO: Implement addition of new event bind
  }, [])

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

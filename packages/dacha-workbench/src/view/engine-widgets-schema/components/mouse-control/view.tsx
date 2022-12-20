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

import { events } from './events'
import { InputBind } from './input-bind'

import './style.less'

export interface InputEventBindings {
  [key: string]: {
    messageType: string
    attrs: Record<string, unknown>
  }
}

export const MouseControlWidget: FC<WidgetProps> = ({ path }) => {
  const { t } = useTranslation()

  const { sceneContext } = useContext(EngineContext)
  const projectConfig = sceneContext.data.projectConfig as Data

  const options = useMemo(() => events.map(({ title, value }) => ({
    title: t(title),
    value,
  })), [])
  const inputEventBindings = useMemo(
    () => get(projectConfig, path.concat('inputEventBindings')) as InputEventBindings,
    [projectConfig],
  )
  const availableOptions = useMemo(
    () => options.filter((event) => !inputEventBindings[event.value]),
    [inputEventBindings, options],
  )
  const addedOptions = useMemo(
    () => options.filter((event) => inputEventBindings[event.value]),
    [inputEventBindings, options],
  )

  const handleAddNewBind = useCallback(() => {
    // TODO: Implement addition of new event bind
  }, [])

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

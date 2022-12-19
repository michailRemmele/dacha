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
import { LabelledSelect } from '../../../modules/inspector/components/select'
import { LabelledTextInput } from '../../../modules/inspector/components/text-input'
import { MultiField } from '../../../modules/inspector/components/multi-field'
import { Field } from '../../../modules/inspector/components/field'
import { Panel } from '../../../modules/inspector/components/panel'

import './style.less'

const events = [
  {
    title: 'components.mouseControl.event.mouseLeftButtonClick.title',
    value: 'MOUSE_LEFT_BUTTON_CLICK',
  },
  {
    title: 'components.mouseControl.event.mouseRightButtonClick.title',
    value: 'MOUSE_RIGHT_BUTTON_CLICK',
  },
  {
    title: 'components.mouseControl.event.mouseDoubleClick.title',
    value: 'MOUSE_DOUBLE_CLICK',
  },
  {
    title: 'components.mouseControl.event.mouseMove.title',
    value: 'MOUSE_MOVE',
  },
  {
    title: 'components.mouseControl.event.mouseEnter.title',
    value: 'MOUSE_ENTER',
  },
  {
    title: 'components.mouseControl.event.mouseLeave.title',
    value: 'MOUSE_LEAVE',
  },
  {
    title: 'components.mouseControl.event.mouseLeftButtonPress.title',
    value: 'MOUSE_LEFT_BUTTON_PRESS',
  },
  {
    title: 'components.mouseControl.event.mouseLeftButtonRelease.title',
    value: 'MOUSE_LEFT_BUTTON_RELEASE',
  },
  {
    title: 'components.mouseControl.event.mouseRightButtonPress.title',
    value: 'MOUSE_RIGHT_BUTTON_PRESS',
  },
  {
    title: 'components.mouseControl.event.mouseRightButtonRelease.title',
    value: 'MOUSE_RIGHT_BUTTON_RELEASE',
  },
  {
    title: 'components.mouseControl.event.mouseMiddleButtonPress.title',
    value: 'MOUSE_MIDDLE_BUTTON_PRESS',
  },
  {
    title: 'components.mouseControl.event.mouseMiddleButtonRelease.title',
    value: 'MOUSE_MIDDLE_BUTTON_RELEASE',
  },
]

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
    [inputEventBindings],
  )
  const addedOptions = useMemo(
    () => options.filter((event) => inputEventBindings[event.value]),
    [inputEventBindings],
  )

  const handleChange = useCallback(() => {
    // TODO: Implement event change callback
  }, [])
  const handleAddNewBind = useCallback(() => {
    // TODO: Implement addition of new event bind
  }, [])
  const handleDeleteBind = useCallback(() => {
    // TODO: Implement deletion of event bind
  }, [])

  return (
    <div>
      <ul className="mouse-control__events">
        {addedOptions.map((event, index) => (
          <li className="mouse-control__fieldset" key={event.value}>
            <Panel
              className="mouse-control__panel"
              title={t('components.mouseControl.bind.title', { index: index + 1 })}
              onDelete={handleDeleteBind}
            >
              <LabelledSelect
                // TODO: Need to memoize
                options={[event, ...availableOptions]}
                value={event.value}
                onChange={handleChange}
                label={t('components.mouseControl.bind.event.title')}
              />
              <Field
                path={path.concat('inputEventBindings', event.value, 'messageType')}
                component={LabelledTextInput}
                label={t('components.mouseControl.bind.messageType.title')}
              />
              <span className="mouse-control__section-header">
                {t('components.mouseControl.bind.attributes.title')}
              </span>
              <MultiField
                path={path.concat('inputEventBindings', event.value, 'attrs')}
              />
            </Panel>
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

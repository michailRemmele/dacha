import React, {
  useMemo,
  useCallback,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'

import { LabelledSelect } from '../../../modules/inspector/components/select'
import { LabelledTextInput } from '../../../modules/inspector/components/text-input'
import { MultiField } from '../../../modules/inspector/components/multi-field'
import { Field } from '../../../modules/inspector/components/field'
import { Panel } from '../../../modules/inspector/components/panel'

export interface InputBindProps {
  path: Array<string>
  event: { title: string, value: string }
  order: number
  availableEvents: Array<{ title: string, value: string }>
}

export const InputBind: FC<InputBindProps> = ({
  path,
  event,
  order,
  availableEvents,
}) => {
  const { t } = useTranslation()

  const inputEvents = useMemo(() => [event, ...availableEvents], [availableEvents])

  const handleChange = useCallback(() => {
    // TODO: Implement event change callback
  }, [])
  const handleDeleteBind = useCallback(() => {
    // TODO: Implement deletion of event bind
  }, [])

  return (
    <Panel
      className="mouse-control__panel"
      title={t('components.mouseControl.bind.title', { index: order + 1 })}
      onDelete={handleDeleteBind}
    >
      <LabelledSelect
        options={inputEvents}
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
  )
}

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
import { useCommander } from '../../../hooks'
import { deleteValue } from '../../../commands'

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
  const { dispatch } = useCommander()

  const bindPath = useMemo(() => path.concat('inputEventBindings', `event:${event.value}`), [path, event])
  const eventPath = useMemo(() => bindPath.concat('event'), [bindPath])
  const messageTypePath = useMemo(() => bindPath.concat('messageType'), [bindPath])
  const attrsPath = useMemo(() => bindPath.concat('attrs'), [bindPath])

  const inputEvents = useMemo(() => [event, ...availableEvents], [availableEvents])

  const handleDeleteBind = useCallback(() => {
    dispatch(deleteValue(bindPath))
  }, [dispatch, bindPath])

  return (
    <Panel
      className="mouse-control__panel"
      title={t('components.mouseControl.bind.title', { index: order + 1 })}
      onDelete={handleDeleteBind}
    >
      <Field
        path={eventPath}
        component={LabelledSelect}
        label={t('components.mouseControl.bind.event.title')}
        options={inputEvents}
      />
      <Field
        path={messageTypePath}
        component={LabelledTextInput}
        label={t('components.mouseControl.bind.messageType.title')}
      />
      <span className="mouse-control__section-header">
        {t('components.mouseControl.bind.attributes.title')}
      </span>
      <MultiField
        path={attrsPath}
      />
    </Panel>
  )
}

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

import { RELEASED, PRESSED } from './events'
import { capitalize } from './utils'

const events = [
  {
    title: 'components.keyboardControl.event.pressed.title',
    value: PRESSED,
  },
  {
    title: 'components.keyboardControl.event.released.title',
    value: RELEASED,
  },
]

export interface InputBindProps {
  path: Array<string>
  inputKey: string
  inputEvent: string
  order: number
  availableKeys: Array<{ title: string, value: string }>
}

export const InputBind: FC<InputBindProps> = ({
  path,
  inputKey,
  inputEvent,
  order,
  availableKeys,
}) => {
  const { t } = useTranslation()
  const { dispatch } = useCommander()

  const bindPath = useMemo(
    () => path.concat('inputEventBindings', `event:${inputKey}_${inputEvent}`),
    [path, inputKey, inputEvent],
  )
  const messageTypePath = useMemo(() => bindPath.concat('messageType'), [bindPath])
  const attrsPath = useMemo(() => bindPath.concat('attrs'), [bindPath])

  const inputEvents = useMemo(() => events.map(({ title, value }) => ({
    title: t(title),
    value,
  })), [])

  const inputKeys = useMemo(() => [
    { title: capitalize(inputKey), value: inputKey },
    ...availableKeys.filter((availableKey) => availableKey.value !== inputKey),
  ], [availableKeys])

  const handleKeyChange = useCallback(() => {
    // TODO: Implement key change callback
  }, [])
  const handleEventChange = useCallback(() => {
    // TODO: Implement event change callback
  }, [])
  const handleDeleteBind = useCallback(() => {
    dispatch(deleteValue(bindPath))
  }, [dispatch, bindPath])

  return (
    <Panel
      className="keyboard-control__panel"
      title={t('components.keyboardControl.bind.title', { index: order + 1 })}
      onDelete={handleDeleteBind}
    >
      <LabelledSelect
        options={inputKeys}
        value={inputKey}
        onChange={handleKeyChange}
        label={t('components.keyboardControl.bind.key.title')}
      />
      <LabelledSelect
        options={inputEvents}
        value={inputEvent}
        onChange={handleEventChange}
        label={t('components.keyboardControl.bind.event.title')}
      />
      <Field
        path={messageTypePath}
        component={LabelledTextInput}
        label={t('components.keyboardControl.bind.messageType.title')}
      />
      <span className="keyboard-control__section-header">
        {t('components.keyboardControl.bind.attributes.title')}
      </span>
      <MultiField
        path={attrsPath}
      />
    </Panel>
  )
}

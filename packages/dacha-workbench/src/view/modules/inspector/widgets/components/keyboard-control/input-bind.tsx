import {
  useMemo,
  useCallback,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'

import { LabelledSelect } from '../../../components/select'
import { LabelledTextInput } from '../../../components/text-input'
import { MultiField } from '../../../components/multi-field'
import { Field } from '../../../components/field'
import { Panel } from '../../../components/panel'
import { useCommander } from '../../../../../hooks'
import { deleteValue, setValue } from '../../../../../commands'

import {
  SectionHeaderStyled,
  PanelCSS,
} from './keyboard-control.style'
import { RELEASED, PRESSED } from './events'
import { capitalize } from './utils'
import type { InputEventBindings } from './types'

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
  id: string
  inputKey: string
  inputEvent: string
  order: number
  availableKeys: Array<{ title: string, value: string }>
  bindingsMap: InputEventBindings
}

export const InputBind: FC<InputBindProps> = ({
  path,
  id,
  inputKey,
  inputEvent,
  order,
  availableKeys,
  bindingsMap,
}) => {
  const { t } = useTranslation()
  const { dispatch } = useCommander()

  const bindPath = useMemo(
    () => path.concat('inputEventBindings', `id:${id}`),
    [path],
  )
  const keyPath = useMemo(() => bindPath.concat('key'), [bindPath])
  const eventPath = useMemo(() => bindPath.concat('event'), [bindPath])
  const messageTypePath = useMemo(() => bindPath.concat('messageType'), [bindPath])
  const attrsPath = useMemo(() => bindPath.concat('attrs'), [bindPath])

  const inputEvents = useMemo(
    () => events
      .map(({ title, value }) => ({
        title: t(title),
        value,
      }))
      .filter(({ value }) => !bindingsMap[`${inputKey}_${value}`] || value === inputEvent),
    [bindingsMap, inputEvent, inputKey],
  )

  const inputKeys = useMemo(() => [
    { title: capitalize(inputKey), value: inputKey },
    ...availableKeys.filter((availableKey) => availableKey.value !== inputKey),
  ], [availableKeys, inputKey])

  const handleDeleteBind = useCallback(() => {
    dispatch(deleteValue(bindPath))
  }, [dispatch, bindPath])

  const handleKeyChange = useCallback((newKey: unknown) => {
    dispatch(setValue(eventPath, !bindingsMap[`${newKey as string}_${PRESSED}`] ? PRESSED : RELEASED))
  }, [dispatch, eventPath, bindingsMap])

  return (
    <Panel
      css={PanelCSS}
      title={t('components.keyboardControl.bind.title', { index: order + 1 })}
      onDelete={handleDeleteBind}
    >
      <Field
        path={keyPath}
        component={LabelledSelect}
        label={t('components.keyboardControl.bind.key.title')}
        options={inputKeys}
        onChange={handleKeyChange}
      />
      <Field
        path={eventPath}
        component={LabelledSelect}
        label={t('components.keyboardControl.bind.event.title')}
        options={inputEvents}
      />
      <Field
        path={messageTypePath}
        component={LabelledTextInput}
        label={t('components.keyboardControl.bind.messageType.title')}
      />
      <SectionHeaderStyled>
        {t('components.keyboardControl.bind.attributes.title')}
      </SectionHeaderStyled>
      <MultiField
        path={attrsPath}
      />
    </Panel>
  )
}

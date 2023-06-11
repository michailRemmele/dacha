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
import { deleteValue } from '../../../../../commands'

import {
  PanelCSS,
  SectionHeaderStyled,
} from './mouse-control.style'

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
      css={PanelCSS}
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
      <SectionHeaderStyled>
        {t('components.mouseControl.bind.attributes.title')}
      </SectionHeaderStyled>
      <MultiField
        path={attrsPath}
      />
    </Panel>
  )
}

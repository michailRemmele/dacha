import {
  useMemo,
  useCallback,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'

import { LabelledCheckbox } from '../../../components/checkbox'
import { LabelledTextInput } from '../../../components/text-input'
import { LabelledSelect } from '../../../components/select'
import { MultiField } from '../../../components/multi-field'
import { DependencyField } from '../../../components/dependency-field'
import { Field } from '../../../components/field'
import { Panel } from '../../../components/panel'
import { useCommander, useExtension } from '../../../../../hooks'
import { deleteValue, setValue } from '../../../../../commands'

import { KeyPicker } from './key-picker'
import {
  SectionHeaderStyled,
  PanelCSS,
} from './keyboard-control.style'

const KEEP_EMIT_DEPENDENCY_VALUE = true

export interface InputBindProps {
  path: Array<string>
  id: string
  inputKey: string
  order: number
}

export const InputBind: FC<InputBindProps> = ({
  path,
  id,
  inputKey,
  order,
}) => {
  const { t } = useTranslation()
  const { dispatch } = useCommander()
  const { events } = useExtension()

  const bindPath = useMemo(
    () => path.concat('inputEventBindings', `id:${id}`),
    [path],
  )
  const keyPath = useMemo(() => bindPath.concat('key'), [bindPath])
  const pressedPath = useMemo(() => bindPath.concat('pressed'), [bindPath])
  const keepEmitPath = useMemo(() => bindPath.concat('keepEmit'), [bindPath])
  const eventTypePath = useMemo(() => bindPath.concat('eventType'), [bindPath])
  const attrsPath = useMemo(() => bindPath.concat('attrs'), [bindPath])

  const handleKeyChange = useCallback((value: string) => {
    dispatch(setValue(keyPath, value))
  }, [keyPath, keyPath])

  const handleDeleteBind = useCallback(() => {
    dispatch(deleteValue(bindPath))
  }, [dispatch, bindPath])

  return (
    <Panel
      css={PanelCSS}
      title={t('components.keyboardControl.bind.title', { index: order + 1 })}
      onDelete={handleDeleteBind}
    >
      <KeyPicker
        value={inputKey}
        onChange={handleKeyChange}
      />
      <Field
        path={pressedPath}
        component={LabelledCheckbox}
        label={t('components.keyboardControl.bind.pressed.title')}
      />
      <DependencyField
        path={keepEmitPath}
        component={LabelledCheckbox}
        label={t('components.keyboardControl.bind.keepEmit.title')}
        dependencyPath={pressedPath}
        dependencyValue={KEEP_EMIT_DEPENDENCY_VALUE}
      />
      <Field
        path={eventTypePath}
        component={events ? LabelledSelect : LabelledTextInput}
        label={t('components.keyboardControl.bind.eventType.title')}
        options={events}
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

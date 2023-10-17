import {
  useMemo,
  useCallback,
  FC,
} from 'react'
import { useTranslation, I18nextProvider } from 'react-i18next'
import { ScriptSystem } from 'remiz'

import { Field } from '../../../components/field'
import { LabelledSelect } from '../../../components/select'
import type { WidgetProps } from '../../../../../../types/widget-schema'
import { Widget } from '../../../components/widget'
import { NAMESPACE_EXTENSION } from '../../../../../providers/schemas-provider/consts'
import { useExtension, useConfig, useCommander } from '../../../../../hooks'
import { setValue } from '../../../../../commands'

export const ScriptWidget: FC<WidgetProps> = ({ path }) => {
  const { t, i18n } = useTranslation()
  const { dispatch } = useCommander()

  const { scriptsSchema } = useExtension()

  const namePath = useMemo(() => path.concat('name'), [path])
  const optionsPath = useMemo(() => path.concat('options'), [path])
  const scriptName = useConfig(namePath) as string

  const availableScripts = useMemo(() => {
    const scriptNames = Object.keys(scriptsSchema[ScriptSystem.systemName] || {})
    return scriptNames.map((key) => ({
      title: key,
      value: key,
    }))
  }, [])

  const partSchema = scriptsSchema[ScriptSystem.systemName]?.[scriptName]
  const partFields = partSchema?.fields
  const partReferences = partSchema?.references

  const handleChangeName = useCallback(() => {
    if (partSchema !== void 0) {
      dispatch(setValue(optionsPath, partSchema.getInitialState?.() ?? {}), { isEffect: true })
    }
  }, [partSchema, optionsPath])

  return (
    <>
      <Field
        path={namePath}
        component={LabelledSelect}
        label={t('components.script.name.title')}
        options={availableScripts}
        onAccept={handleChangeName}
      />
      {partFields && (
        <I18nextProvider i18n={i18n} defaultNS={NAMESPACE_EXTENSION}>
          <Widget path={path} fields={partFields} references={partReferences} />
        </I18nextProvider>
      )}
    </>
  )
}

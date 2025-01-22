import {
  useMemo,
  useCallback,
  FC,
} from 'react'
import { useTranslation, I18nextProvider } from 'react-i18next'
import { ScriptSystem } from 'dacha'

import { Panel } from '../../../components/panel'
import { Field } from '../../../components/field'
import { LabelledSelect } from '../../../components/select'
import { Widget } from '../../../components/widget'
import { NAMESPACE_EXTENSION } from '../../../../../providers/schemas-provider/consts'
import { useExtension, useConfig, useCommander } from '../../../../../hooks'
import { setValue, deleteValue } from '../../../../../commands'

import { PanelCSS } from './script-bundle.style'

interface ScriptPanelProps {
  id: string
  path: Array<string>
  order: number
  availableScripts: Array<{ title: string; value: string }>
}

export const ScriptPanel: FC<ScriptPanelProps> = ({
  id,
  path,
  order,
  availableScripts,
}) => {
  const { t, i18n } = useTranslation()
  const { dispatch } = useCommander()

  const { resourcesSchema } = useExtension()

  const scriptPath = useMemo(() => path.concat(`id:${id}`), [path])
  const namePath = useMemo(() => scriptPath.concat('name'), [scriptPath])
  const optionsPath = useMemo(() => scriptPath.concat('options'), [scriptPath])

  const scriptName = useConfig(namePath) as string

  const partSchema = resourcesSchema[ScriptSystem.systemName]?.[scriptName]
  const partFields = partSchema?.fields
  const partReferences = partSchema?.references

  const handleSelect = useCallback((newName: unknown) => {
    const nextPartSchema = resourcesSchema[ScriptSystem.systemName]?.[newName as string]
    if (nextPartSchema !== void 0) {
      dispatch(setValue(optionsPath, nextPartSchema.getInitialState?.() ?? {}, true))
    }
  }, [resourcesSchema, optionsPath])

  const handleDelete = useCallback(() => {
    dispatch(deleteValue(scriptPath))
  }, [dispatch, scriptPath])

  return (
    <Panel
      css={PanelCSS}
      title={t('components.scriptBundle.script.title', { index: order + 1 })}
      onDelete={handleDelete}
    >
      <Field
        path={namePath}
        component={LabelledSelect}
        label={t('components.scriptBundle.script.name.title')}
        options={availableScripts}
        onAccept={handleSelect}
      />
      {partFields && (
        <I18nextProvider i18n={i18n} defaultNS={NAMESPACE_EXTENSION}>
          <Widget path={optionsPath} fields={partFields} references={partReferences} />
        </I18nextProvider>
      )}
    </Panel>
  )
}

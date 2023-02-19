import React, {
  useMemo,
  useEffect,
  useRef,
  FC,
} from 'react'
import { useTranslation, I18nextProvider } from 'react-i18next'

import type { References, WidgetProps } from '../../../../types/widget-schema'
import { Widget } from '../../../modules/inspector/components/widget'
import { NAMESPACE_EXTENSION } from '../../../providers/schemas-provider/consts'
import { useExtension, useConfig, useCommander } from '../../../hooks'
import { setValue } from '../../../commands'

const SCRIPT_SYSTEM_NAME = 'scriptSystem'

export const ScriptWidget: FC<WidgetProps> = ({ fields, path }) => {
  const { i18n } = useTranslation()
  const { dispatch } = useCommander()

  const { scripts, scriptsSchema } = useExtension()

  const namePath = useMemo(() => path.concat('name'), [path])
  const optionsPath = useMemo(() => path.concat('options'), [path])
  const scriptName = useConfig(namePath) as string

  const references: References = useMemo(() => ({
    names: {
      items: Object.keys(scripts[SCRIPT_SYSTEM_NAME] || {}).map((key) => ({
        title: key,
        value: key,
      })),
    },
  }), [])

  const partSchema = scriptsSchema[SCRIPT_SYSTEM_NAME]?.[scriptName]
  const partFields = partSchema?.fields
  const partReferences = partSchema?.references

  const scriptNameRef = useRef(scriptName)
  useEffect(() => {
    if (scriptName !== scriptNameRef.current && partSchema !== void 0) {
      dispatch(setValue(optionsPath, partSchema.getInitialState?.() ?? {}))
      scriptNameRef.current = scriptName
    }
  }, [scriptName])

  return (
    <>
      <Widget path={path} fields={fields} references={references} />
      {partFields && (
        <I18nextProvider i18n={i18n} defaultNS={NAMESPACE_EXTENSION}>
          <Widget path={path} fields={partFields} references={partReferences} />
        </I18nextProvider>
      )}
    </>
  )
}

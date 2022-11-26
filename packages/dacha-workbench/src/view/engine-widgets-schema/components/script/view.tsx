import React, { useContext, useMemo, FC } from 'react'
import { useTranslation, I18nextProvider } from 'react-i18next'

import type { References, WidgetViewProps } from '../../../../types/widget-schema'
import type { Data } from '../../../utils/get'
import { get } from '../../../utils/get'
import { Widget } from '../../../modules/inspector/components/widget'
import { EngineContext } from '../../../providers'
import { NAMESPACE_EXTENSION } from '../../../providers/schemas-provider/consts'
import { useExtension } from '../../../hooks'

const SCRIPT_SYSTEM_NAME = 'scriptSystem'

export const ScriptWidget: FC<WidgetViewProps> = ({ fields, path }) => {
  const { i18n } = useTranslation()
  const { sceneContext } = useContext(EngineContext)

  const { scripts, scriptsSchema } = useExtension()

  const projectConfig = sceneContext.data.projectConfig as Data

  const scriptName = useMemo(() => get(projectConfig, path.concat('name')) as string, [projectConfig])

  const references: References = useMemo(() => ({
    names: {
      items: Object.keys(scripts[SCRIPT_SYSTEM_NAME] || {}).map((key) => ({
        title: key,
        value: key,
      })),
    },
  }), [])

  const partFields = scriptsSchema[SCRIPT_SYSTEM_NAME]?.[scriptName]?.fields
  const partReferences = scriptsSchema[SCRIPT_SYSTEM_NAME]?.[scriptName]?.references

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

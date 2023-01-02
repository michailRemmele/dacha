import React, { useMemo, FC } from 'react'
import { useTranslation, I18nextProvider } from 'react-i18next'

import type { References, WidgetProps } from '../../../../types/widget-schema'
import { Widget } from '../../../modules/inspector/components/widget'
import { NAMESPACE_EXTENSION } from '../../../providers/schemas-provider/consts'
import { useExtension, useMutator } from '../../../hooks'

const SCRIPT_SYSTEM_NAME = 'scriptSystem'

export const ScriptWidget: FC<WidgetProps> = ({ fields, path }) => {
  const { i18n } = useTranslation()

  const { scripts, scriptsSchema } = useExtension()

  const scriptName = useMutator(path.concat('name')) as string

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

import type { FC } from 'react'
import { useTranslation, I18nextProvider } from 'react-i18next'

import { NAMESPACE_EXTENSION } from '../../../../providers/schemas-provider/consts'
import { Widget } from '../widget'
import { schemaRegistry } from '../../schema-registry'

interface BehaviorWidgetProps {
  name: string
  path: string[]
  context?: Record<string, unknown>
  systemName?: string
}

export const BehaviorWidget: FC<BehaviorWidgetProps> = ({
  name,
  path,
  context,
  systemName,
}) => {
  const { i18n } = useTranslation()

  const schema = schemaRegistry.getWidget(systemName ? `behavior.${systemName}` : 'behavior', name)
  if (!schema) {
    return null
  }

  return (
    <I18nextProvider i18n={i18n} defaultNS={NAMESPACE_EXTENSION}>
      <Widget fields={schema.fields} path={path} context={context} />
    </I18nextProvider>
  )
}

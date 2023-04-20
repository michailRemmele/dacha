import React, { useContext, useMemo, FC } from 'react'
import { useTranslation } from 'react-i18next'

import type { References, WidgetProps } from '../../../../../../types/widget-schema'
import { Widget } from '../../../components/widget'
import { SchemasContext } from '../../../../../providers'

export const UIBridgeWidget: FC<WidgetProps> = ({ fields, path, references }) => {
  const { t } = useTranslation()

  const { components } = useContext(SchemasContext)

  const items = useMemo(() => components.map((component) => ({
    title: t(`${component.namespace}:${component.schema.title}`),
    value: component.name,
  })), [components])

  const extReferences: References = useMemo(() => ({
    ...references,
    components: {
      items,
    },
  }), [references])

  return (
    <Widget path={path} fields={fields} references={extReferences} />
  )
}

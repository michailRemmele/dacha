import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { Field } from '../field'
import type { WidgetSchema } from '../../../../../types/widget-schema'

import { fieldTypes } from './field-types'

interface WidgetProps {
  schema: WidgetSchema
  path: Array<string>
}

export const Widget: FC<WidgetProps> = ({ schema, path }) => {
  const { t } = useTranslation()

  return (
    <div>
      {schema.fields.map((field) => (
        <Field
          key={field.name}
          path={path.concat(field.name.split('.'))}
          label={t(`widgetsSchema.${field.title}`)}
          component={fieldTypes[field.type] ? fieldTypes[field.type] : fieldTypes.string}
          {...field.type === 'select' ? { referenceId: field.referenceId, references: schema.references } : {}}
        />
      ))}
    </div>
  )
}

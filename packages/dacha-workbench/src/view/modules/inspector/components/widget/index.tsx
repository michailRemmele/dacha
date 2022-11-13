import React, { FC } from 'react'

import type { WidgetSchema } from '../../../../../types/widget-schema'

import { WidgetField } from './widget-field'

interface WidgetProps {
  schema: WidgetSchema
  path: Array<string>
}

export const Widget: FC<WidgetProps> = ({ schema, path }) => (
  <div>
    {schema.fields.map((field) => (
      <WidgetField
        key={field.name}
        field={field}
        path={path}
        references={schema.references}
      />
    ))}
  </div>
)

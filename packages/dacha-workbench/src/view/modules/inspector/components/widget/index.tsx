import React, { FC } from 'react'

import type { Field, References } from '../../../../../types/widget-schema'

import { WidgetField } from './widget-field'

interface WidgetProps {
  fields: Array<Field>
  references?: References
  path: Array<string>
}

export const Widget: FC<WidgetProps> = ({ fields, references, path }) => (
  <div>
    {fields?.map((field) => (
      <WidgetField
        key={field.name}
        field={field}
        path={path}
        references={references}
      />
    ))}
  </div>
)

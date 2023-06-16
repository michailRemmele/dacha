import type { FC } from 'react'

import type { WidgetProps } from '../../../../../types/widget-schema'

import { WidgetField } from './widget-field'

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

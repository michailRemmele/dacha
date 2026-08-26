import type { FC } from 'react';

import type { WidgetProps } from '../../../../../types/widget-schema';

import { Field } from '../field';

export const Widget: FC<WidgetProps> = ({ path, fields, context }) => (
  <div>
    {fields?.map((field, index) => (
      <Field
        key={`${index}-${field.name}`}
        {...field}
        path={path}
        context={context}
      />
    ))}
  </div>
);

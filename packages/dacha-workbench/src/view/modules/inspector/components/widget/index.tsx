import type { FC, ReactElement } from 'react';

import type {
  Field as FieldSchema,
  WidgetProps,
} from '../../../../../types/widget-schema';
import { formatWidgetName } from '../../../../../utils/format-widget-name';

import { Field } from '../field';
import { Section } from '../section';
import { groupFields } from './group-fields';

const renderField = (
  field: FieldSchema,
  key: string,
  path: string[],
  context?: Record<string, unknown>,
): ReactElement => {
  const { section, ...fieldProps } = field;

  return <Field key={key} {...fieldProps} path={path} context={context} />;
};

export const Widget: FC<WidgetProps> = ({
  path,
  fields,
  sections,
  context,
}) => (
  <div>
    {groupFields(fields).map((item, index) => {
      if (item.kind === 'field') {
        return renderField(
          item.field,
          `${index}-${item.field.name}`,
          path,
          context,
        );
      }

      return (
        <Section
          key={`${index}-${item.section}`}
          title={formatWidgetName(item.section)}
          defaultOpen={sections?.[item.section]?.defaultOpen}
        >
          {item.fields.map((field, fieldIndex) =>
            renderField(field, `${fieldIndex}-${field.name}`, path, context),
          )}
        </Section>
      );
    })}
  </div>
);

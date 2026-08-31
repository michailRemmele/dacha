import type { Field } from '../../../../../types/widget-schema';

export type RenderItem =
  | { kind: 'field'; field: Field }
  | { kind: 'section'; section: string; fields: Field[] };

export const groupFields = (fields: Field[] = []): RenderItem[] => {
  const items: RenderItem[] = [];

  fields.forEach((field) => {
    const last = items[items.length - 1];

    if (
      field.section &&
      last?.kind === 'section' &&
      last.section === field.section
    ) {
      last.fields.push(field);
    } else if (field.section) {
      items.push({ kind: 'section', section: field.section, fields: [field] });
    } else {
      items.push({ kind: 'field', field });
    }
  });

  return items;
};

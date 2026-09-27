type AnyRecord = Record<string, unknown>;

const LAYERS = [
  { id: 'layer-1', name: 'first' },
  { id: 'layer-2', name: 'second' },
];

/** Returns the same sample list for any path an option function reads. */
export const fakeGetState = (): unknown => LAYERS;

export interface NormalizedSchema {
  title?: string;
  icon?: string;
  sections?: AnyRecord;
  fields: AnyRecord[];
}

export const normalizeSchema = (schema: {
  title?: string;
  icon?: string;
  sections?: AnyRecord;
  fields?: AnyRecord[];
}): NormalizedSchema =>
  JSON.parse(
    JSON.stringify({
      title: schema.title,
      icon: schema.icon,
      sections: schema.sections,
      fields: (schema.fields ?? []).map((field) => ({
        ...field,
        options:
          typeof field.options === 'function'
            ? (
                field.options as (get: () => unknown, ctx: AnyRecord) => unknown
              )(fakeGetState, { path: [], data: {} })
            : field.options,
      })),
    }),
  ) as NormalizedSchema;

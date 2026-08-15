import type { WidgetSchema } from '../../../types/widget-schema';

import { NAMESPACE_EDITOR, NAMESPACE_EXTENSION } from './consts';

export interface SchemasDataEntry {
  name: string;
  schema: WidgetSchema;
  namespace: string;
}

export const buildSchema = (
  base: Record<string, WidgetSchema>,
  extension: Record<string, WidgetSchema> | undefined,
): SchemasDataEntry[] =>
  ([] as SchemasDataEntry[]).concat(
    Object.keys(base).map((key) => ({
      name: key,
      schema: base[key],
      namespace: NAMESPACE_EDITOR,
    })),
    extension
      ? Object.keys(extension).map((key) => ({
          name: key,
          schema: extension[key],
          namespace: NAMESPACE_EXTENSION,
        }))
      : [],
  );

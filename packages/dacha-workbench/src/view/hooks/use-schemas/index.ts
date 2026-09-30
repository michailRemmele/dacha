import { useContext, useMemo } from 'react';
import type { SchemaKind } from 'dacha';

import { SchemasContext } from '../../providers';
import { SCHEMA_GROUPS } from '../../../schema/collect-schemas';
import type { WidgetSchema } from '../../../types/widget-schema';

/**
 * Returns the schemas of one kind, such as `behavior` or `shader`, by class name.
 */
export const useSchemas = (kind: SchemaKind): Record<string, WidgetSchema> => {
  const entries = useContext(SchemasContext)[SCHEMA_GROUPS[kind]];
  return useMemo(
    () =>
      Object.fromEntries(entries.map((entry) => [entry.name, entry.schema])),
    [entries],
  );
};

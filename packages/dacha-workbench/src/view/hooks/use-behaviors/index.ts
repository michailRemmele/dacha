import { useContext } from 'react';

import { SchemasContext } from '../../providers';
import type { WidgetSchema } from '../../../types/widget-schema';

/**
 * Returns the behavior schemas of one type, such as `shader` or `filterEffect`,
 * or of behaviors without a type when no type is given.
 */
export const useBehaviors = (
  type?: string,
): Record<string, WidgetSchema> | undefined =>
  useContext(SchemasContext).behaviors[type ?? ''];

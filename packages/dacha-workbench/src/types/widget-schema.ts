import type { FC } from 'react';
import type * as GravityIcons from '@gravity-ui/icons';
import type { Field, SchemaSection } from 'dacha';

export type IconName = keyof typeof GravityIcons;

export interface WidgetProps {
  path: string[];
  fields?: Field[];
  sections?: Record<string, SchemaSection>;
  context?: Record<string, unknown>;
}

export interface WidgetSchema {
  title?: string;
  fields?: Field[];
  sections?: Record<string, SchemaSection>;
  view?: FC<WidgetProps>;
  icon?: IconName;
}

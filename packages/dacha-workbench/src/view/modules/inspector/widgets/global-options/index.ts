import type { WidgetSchema } from '../../../../../types/widget-schema';

import { physics } from './physics';
import { sorting } from './sorting';
import { audioGroups } from './audio-groups';
import { performance } from './performance';

export const globalOptionsSchema: Record<string, WidgetSchema> = {
  physics,
  sorting,
  audioGroups,
  performance,
};

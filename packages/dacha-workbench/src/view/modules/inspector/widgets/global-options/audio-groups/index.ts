import type { WidgetSchema } from '../../../../../../types/widget-schema';

import { AudioGroupsWidget } from './view';

export const audioGroups: WidgetSchema = {
  title: 'globalOptions.audioGroups.title',
  view: AudioGroupsWidget,
  fields: [{ name: 'groups', type: 'data', initialValue: [] }],
};

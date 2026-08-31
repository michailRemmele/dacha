import type { WidgetSchema } from '../../../../../../types/widget-schema';

import { AudioGroupsWidget } from './view';

export const audioGroups: WidgetSchema = {
  title: 'globalOptions.audioGroups.title',
  icon: 'Volume',
  view: AudioGroupsWidget,
  fields: [{ name: 'groups', type: 'data', initialValue: [] }],
};

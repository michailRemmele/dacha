import type { WidgetSchema } from '../../../../../../types/widget-schema';
import type { AudioGroup } from '../../types/audio-system';

const PATH = ['globalOptions', 'name:audioGroups', 'options', 'groups'];
const MASTER_GROUP = 'master';

export const audioSource: WidgetSchema = {
  fields: [
    {
      name: 'src',
      type: 'file',
      initialValue: '',
      extensions: ['mp3', 'wav', 'ogg'],
    },
    {
      name: 'volume',
      type: 'range',
      initialValue: 1,
      min: 0,
      max: 1,
      step: 0.01,
    },
    {
      name: 'looped',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'autoplay',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'group',
      type: 'select',
      initialValue: MASTER_GROUP,
      options: (getState) => [
        MASTER_GROUP,
        ...((getState(PATH) as AudioGroup[]) ?? []).map((group) => group.name),
      ],
    },
  ],
};

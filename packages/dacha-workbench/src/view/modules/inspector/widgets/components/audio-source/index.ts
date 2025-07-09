import type { WidgetSchema } from '../../../../../../types/widget-schema'
import type { AudioGroup } from '../../types/audio-system'

const PATH = ['globalOptions', 'name:audioGroups', 'options', 'groups']
const MASTER_GROUP = 'master'

export const audioSource: WidgetSchema = {
  fields: [
    {
      name: 'src',
      type: 'file',
      extensions: ['mp3', 'wav', 'ogg'],
    },
    {
      name: 'volume',
      type: 'range',
      min: 0,
      max: 1,
      step: 0.01,
    },
    {
      name: 'looped',
      type: 'boolean',
    },
    {
      name: 'autoplay',
      type: 'boolean',
    },
    {
      name: 'group',
      type: 'select',
      options: (getState) => [
        MASTER_GROUP,
        ...(getState(PATH) as AudioGroup[] ?? []).map((group) => group.name),
      ],
    },
  ],
  getInitialState: () => ({
    src: '',
    volume: 1,
    looped: false,
    autoplay: false,
    group: MASTER_GROUP,
  }),
}

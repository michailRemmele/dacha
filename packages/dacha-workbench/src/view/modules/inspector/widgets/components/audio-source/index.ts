import type { WidgetSchema } from '../../../../../../types/widget-schema'

import { AudioSourceWidget } from './view'

export const audioSource: WidgetSchema = {
  title: 'components.audioSource.title',
  fields: [
    {
      name: 'src',
      title: 'components.audioSource.src.title',
      type: 'file',
      properties: {
        extensions: ['mp3', 'wav', 'ogg'],
      },
    },
    {
      name: 'volume',
      title: 'components.audioSource.volume.title',
      type: 'range',
      properties: {
        min: 0,
        max: 1,
        step: 0.01,
      },
    },
    {
      name: 'looped',
      title: 'components.audioSource.looped.title',
      type: 'boolean',
    },
    {
      name: 'autoplay',
      title: 'components.audioSource.autoplay.title',
      type: 'boolean',
    },
    {
      name: 'group',
      title: 'components.audioSource.group.title',
      type: 'select',
      referenceId: 'audioGroups',
    },
  ],
  view: AudioSourceWidget,
  getInitialState: () => ({
    src: '',
    volume: 1,
    looped: false,
    autoplay: false,
    group: 'master',
  }),
}

import type { WidgetSchema } from '../../../../../../types/widget-schema'

export const jammer: WidgetSchema = {
  title: 'systems.jammer.title',
  fields: [
    {
      name: 'messages',
      title: 'systems.jammer.messages.title',
      type: 'multitext',
    },
  ],
  getInitialState: () => ({
    messages: [],
  }),
}

import type { FC } from 'react'

import { Grid } from './grid'
import type { ModalComponentProps } from './types'

interface Modal {
  component: FC<ModalComponentProps>
  title: string
}

export const modals: Record<string, Modal | undefined> = {
  grid: {
    component: Grid,
    title: 'settings.grid.modal.title',
  },
}

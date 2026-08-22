import type { FC } from 'react';

import { Grid } from './grid';
import { DebugLayers } from './debug-layers';
import { Theme } from './theme';
import type { ModalComponentProps } from './types';

interface Modal {
  component: FC<ModalComponentProps>;
  title: string;
}

export const modals: Record<string, Modal | undefined> = {
  grid: {
    component: Grid,
    title: 'settings.grid.modal.title',
  },
  debugLayers: {
    component: DebugLayers,
    title: 'settings.debugLayers.modal.title',
  },
  theme: {
    component: Theme,
    title: 'settings.theme.modal.title',
  },
};

import { forwardRef } from 'react';
import { Grip } from '@gravity-ui/icons';
import { Icon } from '../../../../../components';

import styles from './sorting.module.css';
import { SortingLayer } from './sorting-layer';
import type { SortingLayerProps } from './sorting-layer';

export const DragOverlayView = forwardRef<
  HTMLDivElement,
  Pick<SortingLayerProps, 'id'>
>((props, ref) => (
  <div ref={ref}>
    <SortingLayer
      {...props}
      expandExtra={<Icon className={styles.holder} icon={<Grip />} />}
    />
  </div>
));

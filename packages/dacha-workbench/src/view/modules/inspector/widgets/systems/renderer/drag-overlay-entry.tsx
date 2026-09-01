import { forwardRef } from 'react';
import { Grip } from '@gravity-ui/icons';
import { Icon } from '../../../../../components';

import * as styles from './renderer.module.css';
import { EffectPanel, type EffectPanelProps } from './effect-panel';

export const DragOverlayEntry = forwardRef<HTMLDivElement, EffectPanelProps>(
  (props, ref) => (
    <div ref={ref} className={styles.dragOverlay}>
      <EffectPanel
        extra={<Icon className={styles.holder} icon={<Grip />} />}
        {...props}
      />
    </div>
  ),
);

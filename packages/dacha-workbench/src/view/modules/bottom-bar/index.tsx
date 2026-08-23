import type { FC } from 'react';

import { ReloadButton, CanvasCoordinates, UpdateIndicator } from './components';
import styles from './bottom-bar.module.css';

export const BottomBar: FC = () => (
  <div className={styles.bottomBar}>
    <div className={styles.leftSection}>
      <CanvasCoordinates />
    </div>
    <div className={styles.rightSection}>
      <ReloadButton />
      <UpdateIndicator />
    </div>
  </div>
);

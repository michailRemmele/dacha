import type { FC } from 'react';

import * as styles from '../../toolbar.module.css';
import type { ToolFeaturesProps } from '../types';
import { GridFeature, GRID_FEATURE_NAME } from '../grid-feature';

export const PointerFeatures: FC<ToolFeaturesProps> = ({ features }) => (
  <div className={styles.toolFeatures}>
    <GridFeature value={features[GRID_FEATURE_NAME] as boolean} />
  </div>
);

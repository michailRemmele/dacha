import { FC } from 'react';

import styles from '../../toolbar.module.css';
import { GridFeature, GRID_FEATURE_NAME } from '../grid-feature';
import type { ToolFeaturesProps } from '../types';

import { TemplateFeature, NestToSelectedFeature } from './components';
import { TEMPLATE_FEATURE_NAME, NEST_TO_SELECTED_FEATURE_NAME } from './consts';

export const TemplateFeatures: FC<ToolFeaturesProps> = ({ features }) => (
  <div className={styles.toolFeatures}>
    <NestToSelectedFeature
      value={features[NEST_TO_SELECTED_FEATURE_NAME] as boolean}
    />
    <GridFeature value={features[GRID_FEATURE_NAME] as boolean} />
    <TemplateFeature value={features[TEMPLATE_FEATURE_NAME] as string} />
  </div>
);

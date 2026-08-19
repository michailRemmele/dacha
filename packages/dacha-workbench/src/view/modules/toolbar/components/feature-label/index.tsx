import type { FC, ReactElement } from 'react';
import { Typography } from 'antd';

import { cx } from '../../../../../utils/cx';

import styles from './feature-label.module.css';

interface LabelProps {
  title: string;
  children: ReactElement | ReactElement[];
  className?: string;
}

export const FeatureLabel: FC<LabelProps> = ({
  title,
  children,
  className,
}) => (
  <label className={cx(styles.featureLabel, className)}>
    <Typography.Text className={styles.title}>{title}</Typography.Text>
    {children}
  </label>
);

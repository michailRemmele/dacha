import { FC, ReactElement } from 'react';
import { CaretRight } from '@gravity-ui/icons';

import { Icon } from '../../../../components';
import { cx } from '../../../../../utils/cx';

import styles from './collapse-panel.module.css';

interface PanelExpandProps {
  isActive?: boolean;
  children?: ReactElement | ReactElement[];
}

export const PanelExpand: FC<PanelExpandProps> = ({ isActive, children }) => (
  <>
    {children}
    <Icon
      icon={<CaretRight />}
      className={cx(styles.expandIcon, isActive && styles.expandIconActive)}
      style={{ color: 'var(--ant-color-text-secondary)' }}
    />
  </>
);

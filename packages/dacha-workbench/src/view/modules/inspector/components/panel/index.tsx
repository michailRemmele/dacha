import type { FC, ReactNode, ReactElement } from 'react';
import { TrashBin } from '@gravity-ui/icons';
import { Icon, IconButton } from '../../../../components';

import { cx } from '../../../../../utils/cx';

import styles from './panel.module.css';

export interface PanelProps {
  children:
    ReactElement | (ReactElement | null | undefined)[] | null | undefined;
  title: string;
  onDelete?: () => void;
  extra?: ReactNode;
  size?: 'small' | 'middle';
  className?: string;
}

export const Panel: FC<PanelProps> = ({
  children,
  title,
  onDelete,
  extra,
  size = 'middle',
  className,
}) => (
  <div
    className={cx(
      styles.panel,
      size === 'middle' && styles.panelMiddle,
      size === 'small' && styles.panelSmall,
      className,
    )}
  >
    <div
      className={cx(
        styles.heading,
        size === 'middle' && styles.headingMiddle,
        size === 'small' && styles.headingSmall,
        children && styles.headingBordered,
      )}
    >
      {extra}

      <span>{title}</span>

      {onDelete ? (
        <>
          {size === 'middle' ? (
            <IconButton icon={<Icon icon={<TrashBin />} />} onClick={onDelete} />
          ) : null}
          {size === 'small' ? (
            <IconButton
              className={styles.buttonSmall}
              style={{ width: '18px', height: '18px' }}
              icon={<Icon icon={<TrashBin />} />}
              onClick={onDelete}
            />
          ) : null}
        </>
      ) : null}
    </div>
    {children ? (
      <div
        className={cx(
          styles.content,
          size === 'middle' && styles.contentMiddle,
          size === 'small' && styles.contentSmall,
        )}
      >
        {children}
      </div>
    ) : null}
  </div>
);

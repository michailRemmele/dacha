import {
  useCallback,
  useRef,
  useState,
  type FC,
  type ReactElement,
  type ReactNode,
} from 'react';
import { Collapse } from 'antd';
import { CaretRight, TrashBin } from '@gravity-ui/icons';
import { Icon, IconButton } from '../../../../components';

import { cx } from '../../../../../utils/cx';

import styles from './section.module.css';

export interface SectionProps {
  children:
    ReactElement | (ReactElement | null | undefined)[] | null | undefined;
  title: string;
  id?: string;
  onDelete?: () => void;
  extra?: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export const Section: FC<SectionProps> = ({
  children,
  title,
  id,
  onDelete,
  extra,
  defaultOpen = false,
  className,
}) => {
  const key = id ?? title;
  const ignoreRef = useRef(false);
  const [activeKey, setActiveKey] = useState<string | string[] | undefined>(
    defaultOpen ? key : undefined,
  );

  const handleChange = useCallback((key: string | string[]): void => {
    if (ignoreRef.current) {
      ignoreRef.current = false;
    } else {
      setActiveKey(key);
    }
  }, []);

  const handleDelete = useCallback((): void => {
    ignoreRef.current = true;
    onDelete?.();
  }, [onDelete]);

  const expandIcon = useCallback(
    ({ isActive }: { isActive?: boolean }) => (
      <Icon
        icon={<CaretRight />}
        className={cx(styles.expandIcon, isActive && styles.expandIconActive)}
        style={{ color: 'var(--ant-color-text-secondary)' }}
      />
    ),
    [],
  );

  return (
    <Collapse
      ghost
      className={cx(styles.section, className)}
      classNames={{
        root: styles.root,
        header: styles.header,
      }}
      styles={{
        header: { alignItems: 'center', padding: '4px 0', borderRadius: 0 },
        icon: { marginInlineStart: 0, marginInlineEnd: 0 },
        body: { padding: '0 0 8px 24px' },
      }}
      activeKey={activeKey}
      onChange={handleChange}
      expandIcon={expandIcon}
      items={[
        {
          key,
          label: (
            <span className={styles.label}>
              {extra}
              <span className={styles.title} title={title}>
                {title}
              </span>
            </span>
          ),
          children,
          extra: onDelete ? (
            <IconButton
              className={styles.deleteButton}
              icon={<Icon icon={<TrashBin />} />}
              onClick={handleDelete}
            />
          ) : undefined,
        },
      ]}
    />
  );
};

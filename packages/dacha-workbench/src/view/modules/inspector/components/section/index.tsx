import {
  useCallback,
  useContext,
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
import { NewItemContext } from '../new-item-tracker';

import * as styles from './section.module.css';

const ITEM_KEY = 'section';

export interface SectionProps {
  children:
    ReactElement | (ReactElement | null | undefined)[] | null | undefined;
  title: string;
  onDelete?: () => void;
  extra?: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export const Section: FC<SectionProps> = ({
  children,
  title,
  onDelete,
  extra,
  defaultOpen,
  className,
}) => {
  const isNewItem = useContext(NewItemContext);
  const ignoreRef = useRef(false);
  const [open, setOpen] = useState(defaultOpen ?? isNewItem);

  const handleChange = useCallback((keys: string | string[]): void => {
    if (ignoreRef.current) {
      ignoreRef.current = false;
    } else {
      setOpen(keys.includes(ITEM_KEY));
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
        body: styles.body,
      }}
      styles={{
        header: { alignItems: 'center', padding: '4px 0', borderRadius: 0 },
        icon: { marginInlineStart: 0, marginInlineEnd: 0 },
        body: { padding: '0 0 8px 24px' },
      }}
      activeKey={open ? [ITEM_KEY] : []}
      onChange={handleChange}
      expandIcon={expandIcon}
      items={[
        {
          key: ITEM_KEY,
          forceRender: true,
          label: (
            <span className={styles.label}>
              {extra}
              <span className={styles.title} title={title}>
                {title}
              </span>
            </span>
          ),
          children: (
            <NewItemContext.Provider value={false}>
              {children}
            </NewItemContext.Provider>
          ),
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

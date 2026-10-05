import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useRef,
  FC,
  ReactElement,
} from 'react';
import { Collapse } from 'antd';
import { TrashBin } from '@gravity-ui/icons';

import { Icon, IconButton } from '../../../../components';

import { NewItemContext } from '../new-item-tracker';

import { isPanelExpanded, setPanelExpanded } from './expanded-panels';
import { PanelHeader } from './panel-header';
import { PanelExpand } from './panel-expand';

import * as styles from './collapse-panel.module.css';

const ITEM_KEY = 'panel';

type ExpandIcon = (props: { isActive?: boolean }) => ReactElement;

export interface CollapsePanelProps {
  children: ReactElement | (ReactElement | null)[] | string | null;
  icon?: string;
  title: string;
  onDelete?: (event: React.MouseEvent<HTMLElement>) => void;
  expandExtra?: ReactElement | ReactElement[];
  deletable?: boolean;
  defaultOpen?: boolean;
  persistKey?: string;
  className?: string;
  dataTestId?: string;
}

export const CollapsePanel: FC<CollapsePanelProps> = ({
  children,
  title,
  icon,
  onDelete,
  expandExtra,
  deletable = true,
  defaultOpen,
  persistKey,
  className,
  dataTestId,
}) => {
  const ignoreRef = useRef(false);
  const isNewItem = useContext(NewItemContext);
  const [open, setOpen] = useState(
    () =>
      defaultOpen ??
      (isNewItem || (persistKey !== undefined && isPanelExpanded(persistKey))),
  );

  useEffect(() => {
    if (persistKey) {
      setPanelExpanded(persistKey, open);
    }
  }, []);

  const expandIcon = useCallback<ExpandIcon>(
    ({ isActive }) => (
      <PanelExpand isActive={isActive}>{expandExtra}</PanelExpand>
    ),
    [expandExtra],
  );

  const handleChange = useCallback(
    (keys: string | string[]): void => {
      if (ignoreRef.current) {
        ignoreRef.current = false;
      } else {
        const nextOpen = keys.includes(ITEM_KEY);
        setOpen(nextOpen);
        if (persistKey) {
          setPanelExpanded(persistKey, nextOpen);
        }
      }
    },
    [persistKey],
  );

  const handleDelete = useCallback(
    (event: React.MouseEvent<HTMLElement>): void => {
      ignoreRef.current = true;
      onDelete?.(event);
    },
    [onDelete],
  );

  const items = useMemo(
    () => [
      {
        key: ITEM_KEY,
        label: (
          <PanelHeader
            title={title}
            icon={icon}
            dataTestId={dataTestId ? `${dataTestId}-header` : undefined}
          />
        ),
        children: (
          <NewItemContext.Provider value={false}>
            {children}
          </NewItemContext.Provider>
        ),
        extra: deletable ? (
          <IconButton
            className={styles.deleteButton}
            icon={<Icon icon={<TrashBin />} />}
            onClick={handleDelete}
          />
        ) : undefined,
        'data-testid': dataTestId,
      },
    ],
    [title, icon, dataTestId, children, deletable, handleDelete],
  );

  return (
    <Collapse
      ghost
      className={className}
      classNames={{
        root: styles.collapse,
        header: styles.header,
      }}
      styles={{
        header: { alignItems: 'center', borderRadius: 0 },
        icon: { marginInlineStart: 0, marginInlineEnd: '4px' },
        body: { paddingTop: 0, paddingLeft: '28px' },
      }}
      activeKey={open ? [ITEM_KEY] : []}
      onChange={handleChange}
      expandIcon={expandIcon}
      items={items}
    />
  );
};

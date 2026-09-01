import {
  useCallback,
  useMemo,
  useState,
  useRef,
  FC,
  ReactElement,
} from 'react';
import { Collapse } from 'antd';
import { TrashBin } from '@gravity-ui/icons';

import { Icon, IconButton } from '../../../../components';

import { PanelHeader } from './panel-header';
import { PanelExpand } from './panel-expand';

import * as styles from './collapse-panel.module.css';

type ExpandIcon = (props: { isActive?: boolean }) => ReactElement;

export interface CollapsePanelProps {
  children: ReactElement | (ReactElement | null)[] | string | null;
  icon?: string;
  title: string;
  onDelete?: (event: React.MouseEvent<HTMLElement>) => void;
  expandExtra?: ReactElement | ReactElement[];
  deletable?: boolean;
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
  className,
  dataTestId,
}) => {
  const ignoreRef = useRef(false);
  const [activeKey, setActiveKey] = useState<string | string[]>();

  const expandIcon = useCallback<ExpandIcon>(
    ({ isActive }) => (
      <PanelExpand isActive={isActive}>{expandExtra}</PanelExpand>
    ),
    [expandExtra],
  );

  const handleChange = useCallback((key: string | string[]): void => {
    if (ignoreRef.current) {
      ignoreRef.current = false;
    } else {
      setActiveKey(key);
    }
  }, []);

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
        key: title,
        label: (
          <PanelHeader
            title={title}
            icon={icon}
            dataTestId={dataTestId ? `${dataTestId}-header` : undefined}
          />
        ),
        children,
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
      activeKey={activeKey}
      onChange={handleChange}
      expandIcon={expandIcon}
      items={items}
    />
  );
};

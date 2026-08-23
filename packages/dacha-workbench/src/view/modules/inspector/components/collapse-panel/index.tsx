import { useCallback, useState, useRef, FC, ReactElement } from 'react';
import { Collapse } from 'antd';

import { PanelExtra } from './panel-extra';
import { PanelHeader } from './panel-header';
import { PanelExpand } from './panel-expand';

import styles from './collapse-panel.module.css';

type ExpandIcon = (props: { isActive?: boolean }) => ReactElement;

export interface CollapsePanelProps {
  children: ReactElement | (ReactElement | null)[] | string | null;
  icon?: string;
  title: string;
  onDelete?: (event: React.MouseEvent<HTMLElement>) => void;
  expandExtra?: ReactElement | ReactElement[];
  deletable?: boolean;
  className?: string;
}

export const CollapsePanel: FC<CollapsePanelProps> = ({
  children,
  title,
  icon,
  onDelete,
  expandExtra,
  deletable = true,
  className,
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

  return (
    <Collapse
      ghost
      className={className}
      classNames={{
        root: styles.collapse,
      }}
      styles={{
        header: { alignItems: 'center' },
        icon: { marginInlineEnd: '8px' },
        body: { paddingTop: 0 },
      }}
      activeKey={activeKey}
      onChange={handleChange}
      expandIcon={expandIcon}
      items={[
        {
          key: title,
          label: <PanelHeader title={title} icon={icon} />,
          children,
          extra: deletable ? <PanelExtra onDelete={handleDelete} /> : undefined,
        },
      ]}
    />
  );
};

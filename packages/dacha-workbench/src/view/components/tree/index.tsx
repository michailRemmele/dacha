import { useCallback, useMemo, useEffect, useRef, useState, FC } from 'react';
import type { ReactNode } from 'react';
import { Tree as AntdTree, TreeProps as AntdTreeProps } from 'antd';
import { CaretDown } from '@gravity-ui/icons';

import { Icon } from '../icon';
import { useTreeKeys } from '../../hooks';
import type {
  ExplorerDataNode,
  ExpandFn,
  SelectFn,
  DropFn,
} from '../../../types/tree-node';
import { isScrolledIntoView } from '../../../utils/is-scrolled-into-view';
import { getIdByPath } from '../../../utils/get-id-by-path';
import { filterNestedPaths } from '../../../utils/filter-nested-paths';
import { arraysEqual } from '../../../utils/arrays-equal';

import { useTreeData } from './hooks/use-tree-data';
import { ListWrapper } from './list-wrapper';
import { cx } from '../../../utils/cx';

import styles from './tree.module.css';

interface TreeNodeTitleProps {
  title?: ReactNode | ((data: ExplorerDataNode) => ReactNode);
  selected: boolean;
  getContainer: () => HTMLDivElement;
}

interface TreeProps {
  className?: string;
  treeData: ExplorerDataNode[];
  selectedPaths?: string[][];
  inspectedKey?: string;
  persistentStorageKey?: string;
  draggable?: boolean;
  onDrop?: (sourcePaths: string[][], destinationPath: string[]) => void;
  childrenFieldMap?: Record<string, string | undefined>;
  onSelect?: (paths: string[][]) => void;
  onInspect?: (path: string[] | undefined) => void;
  onClickOutside?: () => void;
  showIcon?: boolean;
}

const defaultStyles: AntdTreeProps['styles'] = {
  item: {
    margin: 0,
  },
  itemSwitcher: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginInlineEnd: 0,
    color: 'var(--ant-color-text-secondary)',
  },
};

export const TreeNodeTitle: FC<TreeNodeTitleProps> = ({
  title,
  selected,
  getContainer,
}) => {
  const nodeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!nodeRef.current) {
      return;
    }

    if (selected && !isScrolledIntoView(nodeRef.current, getContainer())) {
      nodeRef.current.scrollIntoView({ block: 'center' });
    }
  }, [selected]);

  return <span ref={nodeRef}>{title as string}</span>;
};

export const Tree: FC<TreeProps> = ({
  className,
  treeData,
  inspectedKey,
  selectedPaths,
  persistentStorageKey,
  draggable,
  onDrop,
  childrenFieldMap,
  onSelect,
  onInspect,
  onClickOutside,
  showIcon = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<number>();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return undefined;
    }

    const observer = new ResizeObserver(([entry]) => {
      setContainerHeight(entry.contentRect.height);
    });
    observer.observe(container);

    return (): void => observer.disconnect();
  }, []);

  const { expandedKeys, setExpandedKeys } = useTreeKeys(
    treeData,
    inspectedKey,
    persistentStorageKey ? `${persistentStorageKey}.expandedKeys` : undefined,
  );
  const { treeData: parsedTreeData } = useTreeData(treeData);

  const selectedKeys = useMemo(
    () => selectedPaths?.map(getIdByPath),
    [selectedPaths],
  );

  const handleExpand = useCallback<ExpandFn>((keys) => {
    setExpandedKeys(keys as string[]);
  }, []);

  const handleSelect = useCallback<SelectFn<ExplorerDataNode>>(
    (keys, info) => {
      const { selectedNodes, node } = info;

      onSelect?.(
        selectedNodes.map((selectedNode) => selectedNode.path.slice(0)),
      );
      onInspect?.(selectedNodes.length ? node.path.slice(0) : undefined);
    },
    [onSelect, onInspect],
  );

  const handleDrop = useCallback<DropFn<ExplorerDataNode>>(
    (info) => {
      if (!onDrop || !childrenFieldMap) {
        return;
      }
      const { node, dragNode } = info;

      const isWithinSelection = selectedPaths?.some(
        (path) => getIdByPath(path) === dragNode.key,
      );
      const paths = isWithinSelection
        ? (selectedPaths as string[][])
        : [dragNode.path];

      const sourcePaths = filterNestedPaths(paths);
      const childrenField = childrenFieldMap[node.path.at(-2) as string];
      if (!childrenField) {
        return;
      }
      const destinationPath = node.path.concat(childrenField);

      if (
        sourcePaths.some((path) =>
          arraysEqual(path.slice(0, -1), destinationPath),
        )
      ) {
        return;
      }
      if (sourcePaths.some((path) => arraysEqual(path, node.path))) {
        return;
      }

      onDrop(sourcePaths, destinationPath);
    },
    [selectedPaths, onDrop, childrenFieldMap],
  );

  const getContainer = useCallback(
    () => containerRef.current as HTMLDivElement,
    [],
  );

  return (
    <ListWrapper ref={containerRef} onClickOutside={onClickOutside}>
      <AntdTree.DirectoryTree
        className={cx(styles.tree, className)}
        styles={defaultStyles}
        height={containerHeight}
        expandedKeys={expandedKeys}
        selectedKeys={selectedKeys}
        onSelect={handleSelect}
        onExpand={handleExpand}
        onDrop={handleDrop}
        treeData={parsedTreeData}
        expandAction="doubleClick"
        draggable={draggable ? { icon: false } : undefined}
        multiple
        titleRender={(nodeData: ExplorerDataNode): ReactNode => (
          <TreeNodeTitle
            title={nodeData.title}
            selected={selectedKeys?.includes(String(nodeData.key)) ?? false}
            getContainer={getContainer}
          />
        )}
        showIcon={showIcon}
        switcherIcon={<Icon icon={<CaretDown />} />}
      />
    </ListWrapper>
  );
};

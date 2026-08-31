import type { ReactNode } from 'react';
import type { Animation } from 'dacha';
import type { DataNode } from 'antd/lib/tree';
import { Square, Layers, ArrowsExpand } from '@gravity-ui/icons';

import type { InspectedEntity } from '../../types';
import { getStatePath, getSubstatePath } from '../../utils/paths';
import { Icon } from '../../../../../../../../components';
import { STATE_TYPE } from '../../const';

import styles from './state-list.module.css';

export interface StateDataNode extends DataNode {
  parent?: StateDataNode;
  path: string[];
}

const parseSubstate = (
  { id, name, x, y }: Animation.SubstateConfig,
  path: string[],
  parent: StateDataNode,
): StateDataNode => ({
  key: id,
  title: `${name} (x: ${x}${y !== undefined ? `, y: ${y}` : ''})`,
  icon: <Icon icon={<ArrowsExpand />} />,
  isLeaf: true,
  parent,
  path: path.concat('substates', `id:${id}`),
});

export const parseStates = (
  states: Animation.StateConfig[],
  path: string[],
  initialState: string,
  initialSuffix: string,
): StateDataNode[] =>
  states.map((state) => {
    const statePath = path.concat('states', `id:${state.id}`);

    const node: StateDataNode = {
      key: state.id,
      title: (): ReactNode => {
        if (state.id === initialState) {
          return (
            <>
              <span className={styles.listItemInitial}>{state.name}</span>
              <span className={styles.listItemSuffix}>{initialSuffix}</span>
            </>
          );
        }
        return state.name;
      },
      icon: (
        <Icon
          icon={state.type === STATE_TYPE.GROUP ? <Layers /> : <Square />}
        />
      ),
      path: statePath,
    };

    node.children = (state as Animation.GroupStateConfig)?.substates?.map(
      (substate) => parseSubstate(substate, statePath, node),
    );

    return node;
  });

export const getSelectedPaths = (
  paths: string[][],
  inspectedEntity?: InspectedEntity,
): string[][] => {
  const selectedPaths = paths.filter(
    (path) => path.at(-2) === 'states' || path.at(-2) === 'substates',
  );

  if (
    !selectedPaths.length &&
    (inspectedEntity?.type === 'transition' ||
      inspectedEntity?.type === 'frame')
  ) {
    const statePath = getStatePath(inspectedEntity.path);
    const substatePath = getSubstatePath(inspectedEntity.path);
    const selectedPath = substatePath ?? statePath;
    return selectedPath ? [selectedPath] : [];
  }

  return selectedPaths;
};

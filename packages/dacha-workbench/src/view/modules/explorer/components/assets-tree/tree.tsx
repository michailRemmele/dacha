import { useContext, useMemo, FC } from 'react';
import type { AssetConfig } from 'dacha';

import {
  InspectedEntityContext,
  EntitySelectionContext,
} from '../../../../providers';
import { useConfig } from '../../../../hooks';
import { Tree } from '../tree';

import { parseAssets, getInspectedKey, getSelectedPaths } from './utils';

export const AssetsTree: FC = () => {
  const { path: inspectedEntityPath } = useContext(InspectedEntityContext);
  const { paths: selectedEntitiesPaths } = useContext(EntitySelectionContext);

  const assets = useConfig('assets') as AssetConfig[];
  const treeData = useMemo(() => parseAssets(assets), [assets]);

  return (
    <Tree
      treeData={treeData}
      inspectedKey={getInspectedKey(inspectedEntityPath)}
      selectedPaths={getSelectedPaths(selectedEntitiesPaths)}
      persistentStorageKey="explorer.tab.assets"
    />
  );
};

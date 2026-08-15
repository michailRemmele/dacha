import { useCallback, useContext, FC } from 'react';

import { useCommander } from '../../../../hooks';
import {
  EntitySelectionContext,
  HotkeysSectionProvider,
} from '../../../../providers';
import { copyAssets, deleteAssets } from '../../../../commands/assets';

import { getSelectedPaths } from './utils';
import { ActionBar } from './action-bar';
import { AssetsTree } from './tree';

const ROOT_PATH = ['assets'];
const NOOP = (): void => {};

export const AssetsExplorer: FC = () => {
  const { paths: selectedPaths } = useContext(EntitySelectionContext);
  const { dispatch } = useCommander();

  const handleRemove = useCallback(
    (paths: string[][]) => dispatch(deleteAssets(paths)),
    [dispatch],
  );
  const handleCopyTo = useCallback(
    (source: string[][]) => dispatch(copyAssets(source)),
    [dispatch],
  );

  return (
    <HotkeysSectionProvider
      childrenFieldMap={{}}
      rootPath={ROOT_PATH}
      selectedPaths={getSelectedPaths(selectedPaths)}
      onCopyTo={handleCopyTo}
      onMoveTo={NOOP}
      onRemove={handleRemove}
    >
      <ActionBar />
      <AssetsTree />
    </HotkeysSectionProvider>
  );
};

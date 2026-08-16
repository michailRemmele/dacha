import { uuid } from '../../../utils/uuid';
import type { AssetConfig } from 'dacha';

import { getUniqueName } from '../../../utils/get-unique-name';
import { addValues } from '..';
import type { DispatchFn, GetStateFn } from '../../hooks/use-commander';

const getDuplicate = (
  asset: AssetConfig,
  siblings: AssetConfig[],
): AssetConfig => {
  const duplicate = structuredClone(asset);
  duplicate.id = uuid();
  duplicate.name = getUniqueName(duplicate.name, siblings);
  return duplicate;
};

export const copyAssets =
  (sourcePaths: string[][]) =>
  (dispatch: DispatchFn, getState: GetStateFn): void => {
    const assets = getState(['assets']) as AssetConfig[] | undefined;
    if (!assets) {
      return;
    }

    const { values } = sourcePaths.reduce(
      (acc, path) => {
        const value = getState(path) as AssetConfig | undefined;
        if (value) {
          const duplicate = getDuplicate(value, acc.siblings);
          acc.values.push(duplicate);
          acc.siblings.push(duplicate);
        }
        return acc;
      },
      { values: [] as AssetConfig[], siblings: assets.slice(0) },
    );

    if (!values.length) {
      return;
    }

    dispatch(addValues(['assets'], values));
  };

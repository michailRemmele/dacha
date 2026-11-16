import { uuid } from '../../../utils/uuid';
import type { AssetConfig } from 'dacha';

import { getUniqueName } from '../../../utils/get-unique-name';
import { addValues } from '..';
import type {
  CommandContext,
  DispatchFn,
  GetStateFn,
} from '../../hooks/use-commander';
import { remapReferences } from '../../../utils/remap-references';

const getDuplicate = (
  asset: AssetConfig,
  siblings: AssetConfig[],
  idMap: Map<string, string>,
): AssetConfig => {
  const duplicate = structuredClone(asset);
  duplicate.id = uuid();
  idMap.set(asset.id, duplicate.id);
  duplicate.name = getUniqueName(duplicate.name, siblings);
  return duplicate;
};

export const copyAssets =
  (sourcePaths: string[][]) =>
  (
    dispatch: DispatchFn,
    getState: GetStateFn,
    { walker }: CommandContext,
  ): void => {
    const assets = getState(['assets']) as AssetConfig[] | undefined;
    if (!assets) {
      return;
    }

    const idMap = new Map<string, string>();
    const { values } = sourcePaths.reduce(
      (acc, path) => {
        const value = getState(path) as AssetConfig | undefined;
        if (value) {
          const duplicate = getDuplicate(value, acc.siblings, idMap);
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

    remapReferences(walker, { assets: values }, idMap);

    dispatch(addValues(['assets'], values));
  };

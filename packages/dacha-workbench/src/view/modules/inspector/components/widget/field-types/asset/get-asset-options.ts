import type { AssetConfig } from 'dacha';

import type { SelectOption } from '../../../../../../../types/inputs';

export const getAssetOptions = (
  assets: AssetConfig[] | undefined,
  kind: string,
): SelectOption[] =>
  (assets ?? [])
    .filter((asset) => asset.kind === kind)
    .map((asset) => ({ title: asset.name, value: asset.id }));

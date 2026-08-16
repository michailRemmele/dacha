import { uuid } from '../../../utils/uuid';
import type { AssetConfig } from 'dacha';

import type { WidgetSchema } from '../../../types/widget-schema';
import { buildInitialState } from '../../../schema';
import { getUniqueName } from '../../../utils/get-unique-name';
import { addValue } from '..';
import type { DispatchFn, GetStateFn } from '../../hooks/use-commander';

export const addAsset =
  (kind: string, schema: WidgetSchema) =>
  (dispatch: DispatchFn, getState: GetStateFn): void => {
    const assets = (getState(['assets']) as AssetConfig[] | undefined) ?? [];

    const asset: AssetConfig = {
      id: uuid(),
      name: getUniqueName(kind, assets),
      kind,
      data: buildInitialState(schema.fields ?? []),
    };

    dispatch(addValue<AssetConfig>(['assets'], asset));
  };

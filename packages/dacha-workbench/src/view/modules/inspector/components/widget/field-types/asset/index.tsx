import { useMemo, FC } from 'react';
import { useTranslation } from 'react-i18next';
import type { AssetConfig } from 'dacha';

import { useStore } from '../../../../../../hooks';
import { LabelledSelect } from '../../../select';
import type {
  SelectProps,
  SelectOption,
} from '../../../../../../../types/inputs';
import type { LabelledProps } from '../../../labelled';
import { NAMESPACE_EDITOR } from '../../../../../../providers/schemas-provider/consts';

type AssetFieldProps = {
  kind: string;
} & Omit<SelectProps, 'options'> &
  Omit<LabelledProps, 'children'>;

export const AssetField: FC<AssetFieldProps> = ({ kind, value, ...props }) => {
  const { t } = useTranslation();
  const store = useStore();

  const options = useMemo<SelectOption[]>(() => {
    const assets = store.get(['assets']) as AssetConfig[];
    return assets
      .filter((asset) => asset.kind === kind)
      .map((asset) => ({ title: asset.name, value: asset.id }));
  }, [store, kind]);

  const formattedValue = useMemo(() => {
    const option = options.find((opt) => opt.value === value);
    return option
      ? value
      : t('inspector.components.select.option.none.title', {
          ns: NAMESPACE_EDITOR,
        });
  }, [value, options, t]);

  return <LabelledSelect options={options} value={formattedValue} {...props} />;
};

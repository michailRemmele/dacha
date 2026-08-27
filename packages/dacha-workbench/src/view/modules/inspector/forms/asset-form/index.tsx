import { useMemo, useContext, FC } from 'react';
import { useTranslation } from 'react-i18next';
import type { AssetConfig } from 'dacha';

import { useConfig } from '../../../../hooks';
import { SchemasContext } from '../../../../providers';
import { InputField, LabelledTextInput, Form } from '../../components';
import { Widget } from '../../components/widget';
import type { FormComponentProps } from '../types';

export const AssetForm: FC<FormComponentProps> = ({ path }) => {
  const { t } = useTranslation();
  const { assets } = useContext(SchemasContext);

  const asset = useConfig(path) as AssetConfig | undefined;

  const schemaEntry = useMemo(
    () => assets.find((entry) => entry.name === asset?.kind),
    [assets, asset?.kind],
  );

  const namePath = useMemo(() => path.concat('name'), [path]);
  const dataPath = useMemo(() => path.concat('data'), [path]);

  if (!asset || !schemaEntry) {
    return null;
  }

  return (
    <Form>
      <InputField
        path={namePath}
        component={LabelledTextInput}
        label={t('inspector.assetForm.field.name.label')}
      />

      <Widget {...schemaEntry.schema} path={dataPath} />
    </Form>
  );
};

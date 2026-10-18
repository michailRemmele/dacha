import { useMemo, useContext, FC } from 'react';
import { useTranslation, I18nextProvider } from 'react-i18next';
import type { AssetConfig } from 'dacha';

import { useConfig } from '../../../../hooks';
import { SchemasContext } from '../../../../providers';
import { InputField, LabelledTextInput, Form } from '../../components';
import { Widget } from '../../components/widget';
import type { FormComponentProps } from '../types';

export const AssetForm: FC<FormComponentProps> = ({ path }) => {
  const { t, i18n } = useTranslation();
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

  const { view: View } = schemaEntry.schema;

  return (
    <Form>
      <InputField
        path={namePath}
        component={LabelledTextInput}
        label={t('inspector.assetForm.field.name.label')}
      />

      <I18nextProvider i18n={i18n} defaultNS={schemaEntry.namespace}>
        {View ? (
          <View {...schemaEntry.schema} path={dataPath} />
        ) : (
          <Widget {...schemaEntry.schema} path={dataPath} />
        )}
      </I18nextProvider>
    </Form>
  );
};

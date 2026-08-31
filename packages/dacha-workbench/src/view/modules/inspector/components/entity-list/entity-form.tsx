import type { FC } from 'react';
import { useTranslation, I18nextProvider } from 'react-i18next';

import { Widget } from '../widget';
import { CustomWidget } from '../custom-widget';

import type { Entity } from './types';
import styles from './entity-list.module.css';

interface EntityFormProps extends Entity {
  path: string[];
}

export const EntityForm: FC<EntityFormProps> = ({ data, path }) => {
  const { t, i18n } = useTranslation();

  const { schema, namespace } = data;

  if (!schema || !namespace) {
    return (
      <div className={styles.entityForm}>
        {t('inspector.entityList.content.noSchema.title')}
      </div>
    );
  }

  if (schema.view) {
    return <CustomWidget {...schema} path={path} namespace={namespace} />;
  }

  if (!schema.fields || schema.fields.length === 0) {
    return (
      <div className={styles.entityForm}>
        {t('inspector.entityList.content.empty.title')}
      </div>
    );
  }

  return (
    <I18nextProvider i18n={i18n} defaultNS={namespace}>
      <Widget {...schema} path={path} />
    </I18nextProvider>
  );
};

import { useMemo, useCallback, type FC, type ReactNode } from 'react';
import { useTranslation, I18nextProvider } from 'react-i18next';

import type { WidgetSchema } from '../../../../../../../types/widget-schema';
import { formatWidgetName } from '../../../../../../../utils/format-widget-name';
import { cx } from '../../../../../../../utils/cx';
import { NAMESPACE_EXTENSION } from '../../../../../../providers/schemas-provider/consts';
import { Section } from '../../../section';
import { Widget } from '../..';
import { CustomWidget } from '../../../custom-widget';

import type { ListEntry } from './sortable-entries';
import * as styles from './script-field.module.css';

interface ScriptOptionsProps {
  path: string[];
  schema?: WidgetSchema;
  context?: Record<string, unknown>;
}

export const ScriptOptions: FC<ScriptOptionsProps> = ({
  path,
  schema,
  context,
}) => {
  const { t, i18n } = useTranslation();

  if (!schema) {
    return (
      <div className={styles.message}>{t('scriptField.noSchema.title')}</div>
    );
  }
  if (schema.view) {
    return (
      <CustomWidget {...schema} path={path} namespace={NAMESPACE_EXTENSION} />
    );
  }
  if (!schema.fields?.length) {
    return null;
  }
  return (
    <I18nextProvider i18n={i18n} defaultNS={NAMESPACE_EXTENSION}>
      <Widget {...schema} path={path} context={context} />
    </I18nextProvider>
  );
};

export interface ScriptEntryPanelProps {
  entry: ListEntry;
  path: string[];
  schema?: WidgetSchema;
  extra?: ReactNode;
  context?: Record<string, unknown>;
  onDelete: (id: string) => void;
}

export const ScriptEntryPanel: FC<ScriptEntryPanelProps> = ({
  entry,
  path,
  schema,
  extra,
  context,
  onDelete,
}) => {
  const { t } = useTranslation();

  const optionsPath = useMemo(
    () => path.concat(`id:${entry.id}`, 'options'),
    [path, entry.id],
  );

  const handleDelete = useCallback(() => {
    onDelete(entry.id);
  }, [onDelete, entry.id]);

  return (
    <Section
      className={cx(!schema && styles.noSchema)}
      title={
        schema?.title
          ? t(schema.title, { ns: NAMESPACE_EXTENSION })
          : formatWidgetName(entry.name)
      }
      onDelete={handleDelete}
      extra={extra}
    >
      <ScriptOptions path={optionsPath} schema={schema} context={context} />
    </Section>
  );
};

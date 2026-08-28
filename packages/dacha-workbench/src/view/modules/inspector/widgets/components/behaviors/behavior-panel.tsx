import { useMemo, useCallback, FC } from 'react';
import { useTranslation } from 'react-i18next';

import type { WidgetSchema } from '../../../../../../types/widget-schema';
import { Section } from '../../../components/section';
import { BehaviorWidget } from '../../../components/behavior-widget';
import { useConfig, useCommander } from '../../../../../hooks';
import { deleteValue } from '../../../../../commands';
import { formatWidgetName } from '../../../../../../utils/format-widget-name';
import { NAMESPACE_EXTENSION } from '../../../../../providers/schemas-provider/consts';
import { cx } from '../../../../../../utils/cx';

import styles from './behavior.module.css';

interface BehaviorPanelProps {
  id: string;
  path: string[];
  schema?: WidgetSchema;
}

export const BehaviorPanel: FC<BehaviorPanelProps> = ({ id, path, schema }) => {
  const { t } = useTranslation();

  const { dispatch } = useCommander();

  const behaviorPath = useMemo(() => path.concat(`id:${id}`), [path]);
  const namePath = useMemo(() => behaviorPath.concat('name'), [behaviorPath]);
  const optionsPath = useMemo(
    () => behaviorPath.concat('options'),
    [behaviorPath],
  );

  const name = useConfig(namePath) as string;

  const handleDelete = useCallback(() => {
    dispatch(deleteValue(behaviorPath));
  }, [dispatch, behaviorPath]);

  return (
    <Section
      className={cx(!schema && styles.panelNoSchema)}
      title={
        schema?.title
          ? t(schema.title, { ns: NAMESPACE_EXTENSION })
          : formatWidgetName(name)
      }
      onDelete={handleDelete}
    >
      {!schema ? (
        <div className={styles.behaviorForm}>
          {t('components.behaviors.behavior.noSchema.title')}
        </div>
      ) : schema.fields?.length || schema.view ? (
        <BehaviorWidget name={name} path={optionsPath} />
      ) : null}
    </Section>
  );
};

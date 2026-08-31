import { useCallback, useMemo, ReactElement } from 'react';

import { CollapsePanel } from '../collapse-panel';
import { useCommander } from '../../../../hooks';
import { deleteValue } from '../../../../commands';

import { CONFIG_KEY_MAP, PATH_FIELD_MAP, NON_DELETABLE_MAP } from './consts';
import { EntityForm } from './entity-form';
import styles from './entity-list.module.css';
import type { Entity, EntityType } from './types';

export interface EntityPanelProps {
  path: string[];
  entity: Entity;
  type: EntityType;
  expandExtra?: ReactElement | ReactElement[];
}

export const EntityPanel = ({
  path,
  entity,
  type,
  expandExtra,
}: EntityPanelProps): ReactElement => {
  const { dispatch } = useCommander();

  const entityPath = useMemo(
    () => path.concat(PATH_FIELD_MAP[type], `name:${entity.data.name}`),
    [entity, path, type],
  );
  const widgetPath = useMemo(
    () => entityPath.concat(CONFIG_KEY_MAP[type]),
    [entityPath, type],
  );

  const handleDelete = useCallback(() => {
    dispatch(deleteValue(entityPath));
  }, [dispatch, entityPath]);

  return (
    <CollapsePanel
      className={!entity.data.schema ? styles.noSchema : undefined}
      title={entity.label}
      icon={entity.data.schema?.icon}
      onDelete={handleDelete}
      expandExtra={expandExtra}
      deletable={!NON_DELETABLE_MAP[type].includes(entity.data.name)}
      dataTestId={`entity-panel-${entity.label}`}
    >
      <EntityForm {...entity} path={widgetPath} />
    </CollapsePanel>
  );
};

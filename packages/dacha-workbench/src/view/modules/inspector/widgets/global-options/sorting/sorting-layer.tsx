import { useMemo, useCallback, FC, ReactElement } from 'react';
import { TrashBin } from '@gravity-ui/icons';
import { Icon, IconButton } from '../../../../../components';

import { Field } from '../../../components/field';
import { useCommander } from '../../../../../hooks';
import { deleteValue } from '../../../../../commands';

import styles from './sorting.module.css';
import { LAYERS_PATH } from './consts';

export interface SortingLayerProps {
  id: string;
  expandExtra: ReactElement;
}

export const SortingLayer: FC<SortingLayerProps> = ({ id, expandExtra }) => {
  const { dispatch } = useCommander();

  const layerPath = useMemo(
    () => LAYERS_PATH.concat(`id:${id}`),
    [LAYERS_PATH],
  );

  const handleDeleteBind = useCallback(() => {
    dispatch(deleteValue(layerPath));
  }, [dispatch, layerPath]);

  return (
    <div className={styles.layer}>
      {expandExtra}

      <div className={styles.fieldWrapper}>
        <Field name="name" type="string" path={layerPath} />
      </div>

      <IconButton
        className={styles.removeButton}
        icon={<Icon icon={<TrashBin />} />}
        onClick={handleDeleteBind}
      />
    </div>
  );
};

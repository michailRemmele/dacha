import { useMemo, useCallback, FC } from 'react';
import type { CSSProperties } from 'react';
import { Checkbox } from 'antd';
import type { CheckboxChangeEvent } from 'antd/lib/checkbox';

import { useConfig, useCommander } from '../../../../../hooks';
import { setValue } from '../../../../../commands';
import type {
  CollisionLayer,
  CollisionMatrix,
} from '../../types/physics-system';

import { cx } from '../../../../../../utils/cx';

import styles from './physics.module.css';
import { COLLISION_MATRIX_PATH, DEFAULT_LAYER } from './consts';

export interface CollisionMatrixProps {
  layers?: CollisionLayer[];
}

export const CollisionMatrixField: FC<CollisionMatrixProps> = ({ layers }) => {
  const { dispatch } = useCommander();

  const matrix = useConfig(COLLISION_MATRIX_PATH) as
    | CollisionMatrix
    | undefined;

  const formattedLayers = useMemo(
    () => [DEFAULT_LAYER, ...(layers ?? [])],
    [layers],
  );
  const columnLayers = useMemo(
    () => [...formattedLayers].reverse(),
    [formattedLayers],
  );

  const handleChange = useCallback(
    (rowId: string, columnId: string, checked: boolean) => {
      dispatch(
        setValue(COLLISION_MATRIX_PATH, {
          ...matrix,
          [rowId]: {
            ...matrix?.[rowId],
            [columnId]: checked,
          },
          [columnId]: {
            ...matrix?.[columnId],
            [rowId]: checked,
          },
        }),
      );
    },
    [dispatch, matrix],
  );

  if (!formattedLayers.length) {
    return null;
  }

  return (
    <div
      className={styles.matrix}
      style={{ '--matrix-size': formattedLayers.length } as CSSProperties}
    >
      <div className={styles.matrixRow}>
        <div className={styles.matrixLabel} />
        {columnLayers.map((layer) => (
          <div
            className={cx(styles.matrixLabel, styles.matrixHeaderLabel)}
            key={layer.id}
          >
            {layer.name}
          </div>
        ))}
      </div>

      {formattedLayers.map((rowLayer, rowIndex) => (
        <div className={styles.matrixRow} key={rowLayer.id}>
          <div className={styles.matrixLabel}>{rowLayer.name}</div>
          {columnLayers
            .slice(0, formattedLayers.length - rowIndex)
            .map((columnLayer) => (
              <div className={styles.matrixCell} key={columnLayer.id}>
                <Checkbox
                  title={`${rowLayer.name} ✕ ${columnLayer.name}`}
                  checked={matrix?.[rowLayer.id]?.[columnLayer.id] ?? true}
                  onChange={(event: CheckboxChangeEvent) =>
                    handleChange(
                      rowLayer.id,
                      columnLayer.id,
                      event.target.checked,
                    )
                  }
                />
              </div>
            ))}
          {columnLayers
            .slice(formattedLayers.length - rowIndex)
            .map((columnLayer) => (
              <div className={styles.matrixSpacerCell} key={columnLayer.id} />
            ))}
        </div>
      ))}
    </div>
  );
};

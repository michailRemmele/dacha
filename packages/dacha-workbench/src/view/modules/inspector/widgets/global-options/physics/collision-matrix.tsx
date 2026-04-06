import { useMemo, useCallback, FC } from 'react';
import { Checkbox } from 'antd';

import { useConfig, useCommander } from '../../../../../hooks';
import { setValue } from '../../../../../commands';
import type {
  CollisionLayer,
  CollisionMatrix,
} from '../../types/physics-system';

import {
  MatrixStyled,
  MatrixRowStyled,
  MatrixHeaderRowStyled,
  MatrixLabelStyled,
  MatrixCellStyled,
  MatrixHeaderLabelStyled,
  MatrixSpacerCellStyled,
} from './physics.style';
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
    <MatrixStyled size={formattedLayers.length}>
      <MatrixHeaderRowStyled>
        <MatrixLabelStyled />
        {columnLayers.map((layer) => (
          <MatrixHeaderLabelStyled key={layer.id}>
            {layer.name}
          </MatrixHeaderLabelStyled>
        ))}
      </MatrixHeaderRowStyled>

      {formattedLayers.map((rowLayer, rowIndex) => (
        <MatrixRowStyled key={rowLayer.id}>
          <MatrixLabelStyled>{rowLayer.name}</MatrixLabelStyled>
          {columnLayers
            .slice(0, formattedLayers.length - rowIndex)
            .map((columnLayer) => (
              <MatrixCellStyled key={columnLayer.id}>
                <Checkbox
                  checked={matrix?.[rowLayer.id]?.[columnLayer.id] ?? true}
                  onChange={(event) =>
                    handleChange(
                      rowLayer.id,
                      columnLayer.id,
                      event.target.checked,
                    )
                  }
                />
              </MatrixCellStyled>
            ))}
          {columnLayers
            .slice(formattedLayers.length - rowIndex)
            .map((columnLayer) => (
              <MatrixSpacerCellStyled key={columnLayer.id} />
            ))}
        </MatrixRowStyled>
      ))}
    </MatrixStyled>
  );
};

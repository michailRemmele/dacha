import { useMemo, useCallback, FC, ReactElement } from 'react';
import { TrashBin } from '@gravity-ui/icons';
import { Icon } from '../../../../../components';
import { Button } from 'antd';

import { Field } from '../../../components/field';
import { useCommander } from '../../../../../hooks';
import { deleteValue } from '../../../../../commands';

import {
  LayerStyled,
  FieldWrapperStyled,
  RemoveButtonCSS,
} from './sorting.style';
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
    <LayerStyled>
      {expandExtra}

      <FieldWrapperStyled>
        <Field name="name" type="string" path={layerPath} />
      </FieldWrapperStyled>

      <Button
        css={RemoveButtonCSS}
        icon={<Icon icon={<TrashBin />} />}
        size="small"
        onClick={handleDeleteBind}
      />
    </LayerStyled>
  );
};

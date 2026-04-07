import { useMemo, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { DeleteOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import { LabelledTextInput } from '../../../components/text-input';
import { Field } from '../../../components/field';

import {
  LayerStyled,
  FieldWrapperStyled,
  RemoveButtonCSS,
} from './physics.style';
import { COLLISION_LAYERS_PATH } from './consts';

export interface CollisionLayerFieldProps {
  id: string;
  index: number;
  onDelete: (id: string) => void;
}

export const CollisionLayerField: FC<CollisionLayerFieldProps> = ({
  id,
  index,
  onDelete,
}) => {
  const { t } = useTranslation();

  const layerPath = useMemo(
    () => COLLISION_LAYERS_PATH.concat(`id:${id}`),
    [COLLISION_LAYERS_PATH],
  );
  const namePath = useMemo(() => layerPath.concat('name'), [layerPath]);

  return (
    <LayerStyled>
      <FieldWrapperStyled>
        <Field
          path={namePath}
          component={LabelledTextInput}
          label={t('globalOptions.physics.collisionLayers.name.title', {
            index,
          })}
        />
      </FieldWrapperStyled>

      <Button
        css={RemoveButtonCSS}
        icon={<DeleteOutlined />}
        size="small"
        onClick={() => onDelete(id)}
      />
    </LayerStyled>
  );
};

import { useCallback, useMemo, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { TrashBin, Copy } from '@gravity-ui/icons';
import { Icon } from '../../../../../components';
import { Button } from 'antd';

import { Field } from '../../../components/field';

import {
  LayerStyled,
  FieldWrapperStyled,
  FieldButtonCSS,
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

  const handleCopyId = useCallback(() => {
    void navigator.clipboard.writeText(id);
  }, [id]);

  return (
    <LayerStyled>
      <FieldWrapperStyled>
        <Field
          name="name"
          type="string"
          label={t('globalOptions.physics.collisionLayers.name.title', {
            index,
          })}
          path={layerPath}
        />
      </FieldWrapperStyled>

      <Button
        css={FieldButtonCSS}
        icon={<Icon icon={<Copy />} />}
        size="small"
        onClick={handleCopyId}
        title={t('globalOptions.physics.collisionLayers.copy.title')}
      />

      <Button
        css={FieldButtonCSS}
        icon={<Icon icon={<TrashBin />} />}
        size="small"
        onClick={() => onDelete(id)}
        title={t('globalOptions.physics.collisionLayers.delete.title')}
      />
    </LayerStyled>
  );
};

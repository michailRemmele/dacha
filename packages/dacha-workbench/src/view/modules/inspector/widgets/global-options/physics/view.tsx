import { useEffect, useCallback, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';
import { v4 as uuidv4 } from 'uuid';

import { useConfig, useCommander } from '../../../../../hooks';
import { addValue, setValue } from '../../../../../commands';
import { getUniqueName } from '../../../../../../utils/get-unique-name';
import { CollapsePanel } from '../../../components/collapse-panel';
import type {
  PhysicsSettings,
  CollisionLayer,
} from '../../types/physics-system';

import { CollisionLayerField } from './collision-layer';
import { CollisionMatrixField } from './collision-matrix';
import {
  SectionHeaderStyled,
  LayersStyled,
  ButtonCSS,
  EmptyPlaceholderStyled,
} from './physics.style';
import {
  PHYSICS_SETTINGS_PATH,
  DEFAULT_LAYER,
  DEFAULT_LAYER_ID,
} from './consts';

export const PhysicsWidget: FC = () => {
  const { t } = useTranslation();
  const { dispatch } = useCommander();

  const settings = useConfig(PHYSICS_SETTINGS_PATH) as
    | PhysicsSettings
    | undefined;

  useEffect(() => {
    if (settings) {
      return;
    }

    dispatch(
      addValue(['globalOptions'], {
        name: 'physics',
        options: {
          collisionLayers: [],
          collisionMatrix: { [DEFAULT_LAYER_ID]: { [DEFAULT_LAYER_ID]: true } },
        },
      }),
    );
  }, [settings]);

  const updatePhysics = useCallback(
    (newLayers: CollisionLayer[]) => {
      if (!settings) {
        return;
      }

      const { collisionMatrix } = settings;

      const formattedNewLayers = [DEFAULT_LAYER, ...newLayers];

      dispatch(
        setValue(PHYSICS_SETTINGS_PATH, {
          collisionLayers: newLayers,
          collisionMatrix: formattedNewLayers.reduce((rows, rowLayer) => {
            return {
              ...rows,
              [rowLayer.id]: formattedNewLayers.reduce(
                (columns, columnLayer) => {
                  return {
                    ...columns,
                    [columnLayer.id]:
                      collisionMatrix[rowLayer.id]?.[columnLayer.id] ?? true,
                  };
                },
                {},
              ),
            };
          }, {}),
        }),
      );
    },
    [dispatch, settings],
  );

  const handleAddNewLayer = useCallback(() => {
    if (!settings) {
      return;
    }

    const { collisionLayers } = settings;

    const newLayers = [
      ...collisionLayers,
      {
        id: uuidv4(),
        name: getUniqueName('layer', collisionLayers),
      },
    ];

    updatePhysics(newLayers);
  }, [dispatch, settings, updatePhysics]);

  const handleDeleteLayer = useCallback(
    (id: string) => {
      if (!settings) {
        return;
      }

      const { collisionLayers } = settings;

      const newLayers = collisionLayers.filter((layer) => layer.id !== id);

      updatePhysics(newLayers);
    },
    [dispatch, settings, updatePhysics],
  );

  return (
    <CollapsePanel title={t('globalOptions.physics.title')} deletable={false}>
      <SectionHeaderStyled>
        {t('globalOptions.physics.collisionLayers.title')}
      </SectionHeaderStyled>

      {settings?.collisionLayers.length ? (
        <LayersStyled>
          {settings?.collisionLayers.map((layer, index) => (
            <CollisionLayerField
              key={layer.id}
              id={layer.id}
              index={index}
              onDelete={handleDeleteLayer}
            />
          ))}
        </LayersStyled>
      ) : (
        <EmptyPlaceholderStyled>
          {t('globalOptions.physics.collisionLayers.empty.placeholder')}
        </EmptyPlaceholderStyled>
      )}

      <Button css={ButtonCSS} size="small" onClick={handleAddNewLayer}>
        {t('globalOptions.physics.collisionLayers.addNew.title')}
      </Button>

      <SectionHeaderStyled>
        {t('globalOptions.physics.collisionMatrix.title')}
      </SectionHeaderStyled>

      <CollisionMatrixField layers={settings?.collisionLayers} />
    </CollapsePanel>
  );
};

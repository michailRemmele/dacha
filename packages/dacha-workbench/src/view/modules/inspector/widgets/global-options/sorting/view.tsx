import { useEffect, useCallback, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { arrayMove } from '@dnd-kit/sortable';
import { type SortingLayer } from 'dacha/renderer';

import { LabelledSelect } from '../../../components';
import { Field } from '../../../components/field';
import { useConfig, useCommander } from '../../../../../hooks';
import { addValue, setValue } from '../../../../../commands';
import { getUniqueName } from '../../../../../../utils/get-unique-name';
import { CollapsePanel } from '../../../components/collapse-panel';

import { SectionHeaderStyled, LayersStyled, ButtonCSS } from './sorting.style';
import { DraggableSortingLayers } from './draggable-sorting-layers';
import { ORDER_PATH, LAYERS_PATH, ORDER_OPTIONS } from './consts';

export const SortingWidget: FC = () => {
  const { t } = useTranslation();
  const { dispatch } = useCommander();

  const layers = useConfig(LAYERS_PATH) as SortingLayer[] | undefined;

  useEffect(() => {
    if (layers) {
      return;
    }

    dispatch(
      addValue(['globalOptions'], {
        name: 'sortingLayers',
        options: {
          order: ORDER_OPTIONS[0].value,
          layers: [],
        },
      }),
    );
  }, [layers]);

  const handleAddNewLayer = useCallback(() => {
    if (!layers) {
      return;
    }

    dispatch(
      addValue<SortingLayer>(LAYERS_PATH, {
        id: uuidv4(),
        name: getUniqueName('layer', layers),
      }),
    );
  }, [dispatch, layers]);

  const handleDragEntity = useCallback(
    (from: number, to: number) => {
      if (!layers) {
        return;
      }

      dispatch(setValue(LAYERS_PATH, arrayMove(layers, from, to)));
    },
    [layers, dispatch],
  );

  return (
    <CollapsePanel title={t('globalOptions.sorting.title')} deletable={false}>
      <Field
        path={ORDER_PATH}
        component={LabelledSelect}
        label={t('globalOptions.sorting.order.title')}
        options={ORDER_OPTIONS}
      />
      <SectionHeaderStyled>
        {t('globalOptions.sorting.layers.title')}
      </SectionHeaderStyled>
      <LayersStyled>
        {layers ? (
          <DraggableSortingLayers
            sortingLayers={layers}
            onDragEntity={handleDragEntity}
          />
        ) : null}
      </LayersStyled>
      <Button css={ButtonCSS} size="small" onClick={handleAddNewLayer}>
        {t('globalOptions.sorting.layers.addNew.title')}
      </Button>
    </CollapsePanel>
  );
};

import { useEffect, useCallback, useRef, useContext, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';
import { uuid } from '../../../../../../utils/uuid';
import { arrayMove } from '@dnd-kit/sortable';
import { type SortingLayer } from 'dacha/renderer';

import type { WidgetProps } from '../../../../../../types/widget-schema';
import { LabelledSelect } from '../../../components';
import { Field } from '../../../components/field';
import { useConfig, useCommander } from '../../../../../hooks';
import { addValue, setValue } from '../../../../../commands';
import { getUniqueName } from '../../../../../../utils/get-unique-name';
import { NeedsReloadContext } from '../../../../../providers';

import styles from './sorting.module.css';
import { DraggableSortingLayers } from './draggable-sorting-layers';
import { SORTING_SETTINGS_PATH, LAYERS_PATH, ORDER_OPTIONS } from './consts';

export const SortingWidget: FC<WidgetProps> = () => {
  const { t } = useTranslation();
  const { dispatch } = useCommander();

  const { setNeedsReload } = useContext(NeedsReloadContext);

  const layers = useConfig(LAYERS_PATH) as SortingLayer[] | undefined;

  const prevLayers = useRef(layers);

  useEffect(() => {
    if (layers === prevLayers.current) {
      return;
    }

    setNeedsReload(true);
    prevLayers.current = layers;
  }, [layers]);

  const handleAddNewLayer = useCallback(() => {
    if (!layers) {
      return;
    }

    dispatch(
      addValue<SortingLayer>(LAYERS_PATH, {
        id: uuid(),
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
    <>
      <Field
        name="order"
        component={LabelledSelect}
        options={ORDER_OPTIONS}
        path={SORTING_SETTINGS_PATH}
      />
      <span className={styles.sectionHeader}>
        {t('globalOptions.sorting.layers.title')}
      </span>
      <div className={styles.layers}>
        {layers ? (
          <DraggableSortingLayers
            sortingLayers={layers}
            onDragEntity={handleDragEntity}
          />
        ) : null}
      </div>
      <Button className={styles.button} onClick={handleAddNewLayer}>
        {t('globalOptions.sorting.layers.addNew.title')}
      </Button>
    </>
  );
};

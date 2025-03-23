import {
  useEffect,
  useCallback,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'antd'
import { v4 as uuidv4 } from 'uuid'
import { arrayMove } from '@dnd-kit/sortable'

import { useConfig, useCommander } from '../../../../../hooks'
import { addValue, setValue } from '../../../../../commands'
import { getUniqueName } from '../../../../../../utils/get-unique-name'
import { CollapsePanel } from '../../../components/collapse-panel'
import type { SortingLayer } from '../../types/sprite-renderer'

import {
  LayersStyled,
  ButtonCSS,
} from './sorting-layers.style'
import { DraggableSortingLayers } from './draggable-sorting-layers'
import { PATH } from './consts'

export const SortingLayersWidget: FC = () => {
  const { t } = useTranslation()
  const { dispatch } = useCommander()

  const layers = useConfig(PATH) as SortingLayer[] | undefined

  useEffect(() => {
    if (layers) {
      return
    }

    dispatch(addValue(['globalOptions'], {
      name: 'sortingLayers',
      options: {
        layers: [],
      },
    }))
  }, [layers])

  const handleAddNewLayer = useCallback(() => {
    if (!layers) {
      return
    }

    dispatch(addValue<SortingLayer>(PATH, {
      id: uuidv4(),
      name: getUniqueName('layer', layers),
    }))
  }, [dispatch, layers])

  const handleDragEntity = useCallback((from: number, to: number) => {
    if (!layers) {
      return
    }

    dispatch(setValue(PATH, arrayMove(layers, from, to)))
  }, [layers, dispatch])

  return (
    <CollapsePanel
      title={t('globalOptions.sortingLayers.title')}
      deletable={false}
    >
      <LayersStyled>
        {layers ? (
          <DraggableSortingLayers
            sortingLayers={layers}
            onDragEntity={handleDragEntity}
          />
        ) : null}
      </LayersStyled>
      <Button
        css={ButtonCSS}
        size="small"
        onClick={handleAddNewLayer}
      >
        {t('globalOptions.sortingLayers.addNew.title')}
      </Button>
    </CollapsePanel>
  )
}

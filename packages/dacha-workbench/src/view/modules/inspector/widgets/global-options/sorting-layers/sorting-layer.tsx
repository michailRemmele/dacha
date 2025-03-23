import {
  useMemo,
  useCallback,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { DeleteOutlined } from '@ant-design/icons'
import { Button } from 'antd'

import { LabelledTextInput } from '../../../components/text-input'
import { Field } from '../../../components/field'
import { useCommander } from '../../../../../hooks'
import { deleteValue } from '../../../../../commands'

import {
  LayerStyled,
  FieldWrapperStyled,
  ButtonCSS,
} from './sorting-layers.style'
import { PATH } from './consts'

export interface SortingLayerProps {
  id: string
  expandExtra: JSX.Element
}

export const SortingLayer: FC<SortingLayerProps> = ({ id, expandExtra }) => {
  const { t } = useTranslation()
  const { dispatch } = useCommander()

  const layerPath = useMemo(() => PATH.concat(`id:${id}`), [PATH])
  const namePath = useMemo(() => layerPath.concat('name'), [layerPath])

  const handleDeleteBind = useCallback(() => {
    dispatch(deleteValue(layerPath))
  }, [dispatch, layerPath])

  return (
    <LayerStyled>
      {expandExtra}

      <FieldWrapperStyled>
        <Field
          path={namePath}
          component={LabelledTextInput}
          label={t('globalOptions.sortingLayers.name.title')}
        />
      </FieldWrapperStyled>

      <Button css={ButtonCSS} icon={<DeleteOutlined />} size="small" onClick={handleDeleteBind} />
    </LayerStyled>
  )
}

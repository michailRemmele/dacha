import {
  useCallback,
  useContext,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Checkbox } from 'antd'
import type { CheckboxChangeEvent } from 'antd/lib/checkbox'

import { CheckboxCSS } from '../../toolbar.style'
import { ToolFeature } from '../tool-feature'
import { EngineContext } from '../../../../providers'
import { EventType } from '../../../../../events'

export const GRID_FEATURE_NAME = 'grid'

interface GridFeatureProps {
  value: boolean
}

export const GridFeature: FC<GridFeatureProps> = ({ value }) => {
  const { t } = useTranslation()
  const { world } = useContext(EngineContext)

  const handleChange = useCallback((event: CheckboxChangeEvent): void => {
    world.dispatchEvent(EventType.SetToolFeatureValue, {
      name: GRID_FEATURE_NAME,
      value: event.target.checked,
    })
  }, [world])

  return (
    <ToolFeature>
      <Checkbox
        css={CheckboxCSS}
        checked={value}
        onChange={handleChange}
      >
        {t('toolbar.common.features.grid.title')}
      </Checkbox>
    </ToolFeature>
  )
}

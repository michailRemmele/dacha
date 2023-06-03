import React, {
  useCallback,
  useContext,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Checkbox } from 'antd'
import type { CheckboxChangeEvent } from 'antd/lib/checkbox'

import { ToolFeature } from '../tool-feature'
import { EngineContext } from '../../../../providers'
import { SET_TOOL_FEATURE_VALUE_MSG } from '../../../../../consts/message-types'

export const GRID_FEATURE_NAME = 'grid'

interface GridFeatureProps {
  value: boolean
}

export const GridFeature: FC<GridFeatureProps> = ({ value }) => {
  const { t } = useTranslation()
  const { pushMessage } = useContext(EngineContext)

  const handleChange = useCallback((event: CheckboxChangeEvent): void => {
    pushMessage({
      type: SET_TOOL_FEATURE_VALUE_MSG,
      name: GRID_FEATURE_NAME,
      value: event.target.checked,
    })
  }, [])

  return (
    <ToolFeature>
      <Checkbox
        className="tool-features__checkbox"
        checked={value}
        onChange={handleChange}
      >
        {t('toolbar.common.features.grid.title')}
      </Checkbox>
    </ToolFeature>
  )
}

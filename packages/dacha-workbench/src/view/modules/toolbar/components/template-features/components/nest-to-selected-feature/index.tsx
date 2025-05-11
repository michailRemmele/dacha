import {
  useCallback,
  useContext,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Checkbox } from 'antd'
import type { CheckboxChangeEvent } from 'antd/lib/checkbox'

import { CheckboxCSS } from '../../../../toolbar.style'
import { ToolFeature } from '../../../tool-feature'
import { EngineContext } from '../../../../../../providers'
import { NEST_TO_SELECTED_FEATURE_NAME } from '../../consts'
import { EventType } from '../../../../../../../events'

interface NestToSelectedFeatureProps {
  value: boolean
}

export const NestToSelectedFeature: FC<NestToSelectedFeatureProps> = ({ value }) => {
  const { t } = useTranslation()
  const { world } = useContext(EngineContext)

  const handleChange = useCallback((event: CheckboxChangeEvent): void => {
    world.dispatchEvent(EventType.SetToolFeatureValue, {
      name: NEST_TO_SELECTED_FEATURE_NAME,
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
        {t('toolbar.template.features.nestToSelected.title')}
      </Checkbox>
    </ToolFeature>
  )
}

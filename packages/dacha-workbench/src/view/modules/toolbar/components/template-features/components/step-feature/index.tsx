import React, {
  useCallback,
  useContext,
  useState,
  useEffect,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { InputNumber } from 'antd'

import { FeatureLabel } from '../../../feature-label'
import { ToolFeature } from '../../../tool-feature'
import { EngineContext } from '../../../../../../providers'
import { SET_TOOL_FEATURE_VALUE_MSG } from '../../../../../../../consts/message-types'
import { STEP_FEATURE_NAME } from '../../consts'

import './style.less'

const MIN_STEP = 1

interface StepFeatureProps {
  value: number | null
}

export const StepFeature: FC<StepFeatureProps> = ({ value }) => {
  const { t } = useTranslation()
  const { pushMessage } = useContext(EngineContext)

  const [inputValue, setInputValue] = useState(value)

  useEffect(() => {
    if (inputValue !== null && value !== inputValue) {
      setInputValue(value)
    }
  }, [value])

  const handleChange = useCallback((newValue: number | null): void => {
    setInputValue(newValue)
    pushMessage({
      type: SET_TOOL_FEATURE_VALUE_MSG,
      name: STEP_FEATURE_NAME,
      value: newValue ?? MIN_STEP,
    })
  }, [])

  const handleBlur = useCallback(() => {
    setInputValue(value)
  }, [value])

  return (
    <ToolFeature>
      <FeatureLabel
        title={t('toolbar.template.features.step.title')}
      >
        <InputNumber
          className="tool-features__input"
          type="number"
          size="small"
          min={MIN_STEP}
          value={inputValue}
          onChange={handleChange}
          onBlur={handleBlur}
          controls={false}
          precision={0}
        />
      </FeatureLabel>
    </ToolFeature>
  )
}

import React, {
  useCallback,
  useContext,
  useMemo,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Select } from 'antd'
import type { TemplateConfig } from 'remiz'

import { FeatureLabel } from '../../../feature-label'
import { ToolFeature } from '../../../tool-feature'
import { EngineContext } from '../../../../../../providers'
import { useConfig } from '../../../../../../hooks'
import { SET_TOOL_FEATURE_VALUE_MSG } from '../../../../../../../consts/message-types'
import { TEMPLATE_FEATURE_NAME } from '../../consts'

import './style.less'

interface SelectOption {
  label: string
  value: string
}

interface TemplateFeatureProps {
  value: string
}

export const TemplateFeature: FC<TemplateFeatureProps> = ({ value }) => {
  const { t } = useTranslation()
  const { pushMessage } = useContext(EngineContext)

  const templates = useConfig('templates') as Array<TemplateConfig>

  const options = useMemo(() => templates.map((template) => ({
    label: template.name,
    value: template.id,
  })), [templates])

  const handleChange = useCallback((selectedValue: string | undefined) => {
    pushMessage({
      type: SET_TOOL_FEATURE_VALUE_MSG,
      name: TEMPLATE_FEATURE_NAME,
      value: selectedValue,
    })
  }, [pushMessage])

  const handleFilter = useCallback(
    (input: string, option?: SelectOption) => option !== undefined
      && option.label.toLowerCase().includes(input.toLowerCase()),
    [],
  )

  return (
    <ToolFeature>
      <FeatureLabel
        title={t('toolbar.template.features.template.title')}
      >
        <Select
          className="tool-features__select"
          size="small"
          options={options}
          onChange={handleChange}
          value={value}
          disabled={templates.length === 0}
          showSearch
          filterOption={handleFilter}
        />
      </FeatureLabel>
    </ToolFeature>
  )
}

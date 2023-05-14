import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useMemo,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Select } from 'antd'
import type { TemplateConfig } from 'remiz'

import { EngineContext } from '../../../../providers'
import { useConfig } from '../../../../hooks'
import { SET_TOOL_FEATURE_VALUE_MSG } from '../../../../../consts/message-types'
import { FeatureLabel } from '../feature-label'

import './style.less'

interface SelectOption {
  label: string
  value: string
}

export const TemplatesFeatures: FC = () => {
  const { t } = useTranslation()
  const { pushMessage } = useContext(EngineContext)

  const templates = useConfig('templates') as Array<TemplateConfig>

  const options = useMemo(() => templates.map((template) => ({
    label: template.name,
    value: template.id,
  })), [templates])

  const [value, setValue] = useState<string | undefined>()

  const handleChange = useCallback((selectedValue: string | undefined) => {
    setValue(selectedValue)
    pushMessage({
      type: SET_TOOL_FEATURE_VALUE_MSG,
      name: 'templateId',
      value: selectedValue,
    })
  }, [pushMessage])

  const handleFilter = useCallback(
    (input: string, option?: SelectOption) => option !== undefined
      && option.label.toLowerCase().includes(input.toLowerCase()),
    [],
  )

  useEffect(() => {
    if (value !== undefined && templates.every((template) => template.id !== value)) {
      handleChange(templates[0]?.id)
    } else if (value === undefined && templates.length > 0) {
      handleChange(templates[0].id)
    }
  }, [templates])

  return (
    <div className="tool-features">
      <FeatureLabel title={t('toolbar.template.features.template.title')}>
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
    </div>
  )
}

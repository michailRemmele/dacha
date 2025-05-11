import {
  useCallback,
  useContext,
  useMemo,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Select } from 'antd'
import type { TemplateConfig } from 'dacha'

import { FeatureLabel } from '../../../feature-label'
import { ToolFeature } from '../../../tool-feature'
import { EngineContext } from '../../../../../../providers'
import { useConfig } from '../../../../../../hooks'
import { TEMPLATE_FEATURE_NAME } from '../../consts'
import { EventType } from '../../../../../../../events'

import { SelectCSS } from './template-feature.style'

interface SelectOption {
  label: string
  value: string
}

interface TemplateFeatureProps {
  value: string
}

export const TemplateFeature: FC<TemplateFeatureProps> = ({ value }) => {
  const { t } = useTranslation()
  const { world } = useContext(EngineContext)

  const templates = useConfig('templates') as Array<TemplateConfig>

  const options = useMemo(() => templates.map((template) => ({
    label: template.name,
    value: template.id,
  })), [templates])

  const handleChange = useCallback((selectedValue: string) => {
    world.dispatchEvent(EventType.SetToolFeatureValue, {
      name: TEMPLATE_FEATURE_NAME,
      value: selectedValue,
    })
  }, [world])

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
          css={SelectCSS}
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

import React, {
  useState,
  useCallback,
  useContext,
  useEffect,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import type { RadioChangeEvent } from 'antd'
import { Radio } from 'antd'
import { ZoomInOutlined, ZoomOutOutlined } from '@ant-design/icons'

import { EngineContext } from '../../../../providers'
import { SET_TOOL_FEATURE_VALUE_MSG } from '../../../../../consts/message-types'
import type { FeatureValue } from '../../../../../engine/components/tool'

import type { ToolFeaturesProps } from '../types'

export const ZoomFeatures: FC<ToolFeaturesProps> = ({ features }) => {
  const { t } = useTranslation()
  const { pushMessage } = useContext(EngineContext)

  const [values, setValues] = useState<Record<string, FeatureValue>>({
    direction: '',
  })

  useEffect(() => {
    Object.keys(features).forEach((name) => {
      if (values[name] !== features[name]) {
        setValues({
          ...values,
          [name]: features[name],
        })
      }
    })
  }, [features])

  const handleSelect = useCallback((event: RadioChangeEvent) => {
    pushMessage({
      type: SET_TOOL_FEATURE_VALUE_MSG,
      name: event.target.name,
      value: event.target.value,
    })
  }, [pushMessage])

  return (
    <div className="tool-features">
      <Radio.Group
        name="direction"
        buttonStyle="solid"
        size="small"
        value={values.direction}
        onChange={handleSelect}
      >
        <Radio.Button value="in">
          <ZoomInOutlined title={t('toolbar.zoom.features.direction.in.title')} />
        </Radio.Button>
        <Radio.Button value="out">
          <ZoomOutOutlined title={t('toolbar.zoom.features.direction.out.title')} />
        </Radio.Button>
      </Radio.Group>
    </div>
  )
}

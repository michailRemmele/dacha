import {
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

import { ToolFeaturesStyled, RadioGroupCSS } from '../../toolbar.style'
import { EngineContext } from '../../../../providers'
import type { FeatureValue } from '../../../../../engine/components/tool'
import type { ToolFeaturesProps } from '../types'
import { EventType } from '../../../../../events'

export const ZoomFeatures: FC<ToolFeaturesProps> = ({ features }) => {
  const { t } = useTranslation()
  const { world } = useContext(EngineContext)

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
    world.dispatchEvent(EventType.SetToolFeatureValue, {
      name: event.target.name as string,
      value: event.target.value as string,
    })
  }, [world])

  return (
    <ToolFeaturesStyled>
      <Radio.Group
        css={RadioGroupCSS}
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
    </ToolFeaturesStyled>
  )
}

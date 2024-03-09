import {
  useMemo,
  useCallback,
  useContext,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Input, Button, Space } from 'antd'
import { ArrowRightOutlined } from '@ant-design/icons'
import type { ActorConfig, TemplateConfig } from 'remiz'

import { Labelled } from '../../components'
import { useConfig, useStore } from '../../../../hooks'
import { EngineContext } from '../../../../providers'
import { EventType } from '../../../../../events'

import { SpaceCompactCSS, ButtonCSS } from './actor-form.style'

const ACTOR_PATH_START = 3

interface TemplateFieldProps {
  path: Array<string>
}

export const TemplateField: FC<TemplateFieldProps> = ({ path }) => {
  const { t } = useTranslation()
  const store = useStore()

  const { scene } = useContext(EngineContext)

  const templatePath = useMemo(() => {
    if (store === undefined) {
      return undefined
    }

    const copyPath = path.slice(0)
    const resultPath = []

    while (copyPath.length > ACTOR_PATH_START) {
      const entity = store.get(copyPath) as ActorConfig | ActorConfig['children']

      if (Array.isArray(entity)) {
        resultPath.unshift('children')
      } else {
        resultPath.unshift(`id:${(entity as ActorConfig).templateId as string}`)
      }
      copyPath.pop()
    }
    return ['templates'].concat(resultPath)
  }, [path, store])
  const { name } = useConfig(templatePath) as TemplateConfig

  const handleTemplateInspect = useCallback(() => {
    scene.dispatchEvent(EventType.InspectEntity, {
      path: templatePath,
    })
  }, [templatePath])

  return (
    <Labelled
      label={t('inspector.actorForm.field.templateName.label')}
    >
      <Space.Compact
        css={SpaceCompactCSS}
        size="small"
      >
        <Input value={name} disabled />
        <Button
          css={ButtonCSS}
          icon={<ArrowRightOutlined />}
          onClick={handleTemplateInspect}
        />
      </Space.Compact>
    </Labelled>
  )
}

import {
  useMemo,
  useCallback,
  useContext,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Input, Button, Space } from 'antd'
import { ArrowRightOutlined } from '@ant-design/icons'
import type { ActorConfig, TemplateConfig } from 'dacha'

import { findPathById } from '../../../../../utils/find-path-by-id'
import { Labelled } from '../../components'
import { useConfig, useStore } from '../../../../hooks'
import { EngineContext } from '../../../../providers'
import { EventType } from '../../../../../events'

import { parseTemplatePath } from './utils'
import { SpaceCompactCSS, ButtonCSS } from './actor-form.style'

interface TemplateFieldProps {
  path: Array<string>
}

export const TemplateField: FC<TemplateFieldProps> = ({ path }) => {
  const { t } = useTranslation()
  const store = useStore()

  const { world } = useContext(EngineContext)

  const templatePath = useMemo(() => {
    const actor = store.get(path) as ActorConfig
    const templates = store.get(['templates']) as TemplateConfig[]

    return parseTemplatePath(findPathById(
      templates,
      actor.templateId as string,
      (template) => template.id,
    ))
  }, [path, store])

  const { name } = useConfig(templatePath) as TemplateConfig

  const handleTemplateInspect = useCallback(() => {
    world.dispatchEvent(EventType.SelectEntities, { paths: [templatePath] })
    world.dispatchEvent(EventType.InspectEntity, { path: templatePath })
  }, [templatePath, world])

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

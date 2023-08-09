import {
  useMemo,
  useCallback,
  useContext,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Input, Button, Space } from 'antd'
import { ArrowRightOutlined } from '@ant-design/icons'
import type { GameObjectConfig, TemplateConfig } from 'remiz'

import { Labelled } from '../../components'
import { useConfig, useStore } from '../../../../hooks'
import { EngineContext } from '../../../../providers'
import { INSPECT_ENTITY_MSG } from '../../../../../consts/message-types'

import { SpaceCompactCSS, ButtonCSS } from './game-object-form.style'

const GAME_OBJECT_PATH_START = 3

interface TemplateFieldProps {
  path: Array<string>
}

export const TemplateField: FC<TemplateFieldProps> = ({ path }) => {
  const { t } = useTranslation()
  const store = useStore()

  const { pushMessage } = useContext(EngineContext)

  const templatePath = useMemo(() => {
    if (store === undefined) {
      return undefined
    }

    const copyPath = path.slice(0)
    const resultPath = []

    while (copyPath.length > GAME_OBJECT_PATH_START) {
      const entity = store.get(copyPath) as GameObjectConfig | GameObjectConfig['children']

      if (Array.isArray(entity)) {
        resultPath.unshift('children')
      } else {
        resultPath.unshift(`id:${(entity as GameObjectConfig).templateId as string}`)
      }
      copyPath.pop()
    }
    return ['templates'].concat(resultPath)
  }, [path, store])
  const { name } = useConfig(templatePath) as TemplateConfig

  const handleTemplateInspect = useCallback(() => {
    pushMessage({
      type: INSPECT_ENTITY_MSG,
      path: templatePath,
    })
  }, [pushMessage, templatePath])

  return (
    <Labelled
      label={t('inspector.gameObjectForm.field.templateName.label')}
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

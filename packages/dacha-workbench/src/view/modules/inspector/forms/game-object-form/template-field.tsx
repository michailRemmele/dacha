import React, { useMemo, FC } from 'react'
import { useTranslation } from 'react-i18next'
import type { GameObjectConfig, TemplateConfig } from 'remiz'

import { LabelledTextInput } from '../../components'
import { useConfig, useStore } from '../../../../hooks'

const GAME_OBJECT_PATH_START = 3

interface TemplateFieldProps {
  path: Array<string>
}

export const TemplateField: FC<TemplateFieldProps> = ({ path }) => {
  const { t } = useTranslation()
  const store = useStore()

  const templatePath = useMemo(() => {
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

  return (
    <LabelledTextInput
      label={t('inspector.gameObjectForm.field.templateName.label')}
      value={name}
      disabled
    />
  )
}

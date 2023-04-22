import React, {
  useCallback,
  useContext,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'antd'
import {
  FileAddOutlined,
  DeleteOutlined,
  CopyOutlined,
} from '@ant-design/icons'
import { v4 as uuidv4 } from 'uuid'
import type { TemplateConfig, LevelConfig } from 'remiz'

import { useCommander, useConfig } from '../../../../hooks'
import { addValue, deleteValue, setValue } from '../../../../commands'
import { SelectedEntityContext, EngineContext } from '../../../../providers'
import { INSPECT_ENTITY_MSG } from '../../../../../consts/message-types'
import { duplicateTemplate, getKeysToDelete } from '../../utils'

import { filterLevels } from './utils'

interface ActionBarProps {
  expandedKeys: Array<string>
  setExpandedKeys: (keys: Array<string>) => void
}

export const ActionBar: FC<ActionBarProps> = ({
  expandedKeys,
  setExpandedKeys,
}) => {
  const { t } = useTranslation()
  const { dispatch } = useCommander()

  const { path: selectedEntityPath, type } = useContext(SelectedEntityContext)
  const { pushMessage } = useContext(EngineContext)

  const templates = useConfig('templates') as Array<TemplateConfig>
  const levels = useConfig('levels') as Array<LevelConfig>
  const selectedEntity = useConfig(selectedEntityPath) as TemplateConfig | undefined

  const handleAdd = useCallback(() => {
    const pathToAdd = !selectedEntity || !selectedEntityPath
      ? ['templates']
      : selectedEntityPath.concat('children')
    const index = !selectedEntity || !selectedEntityPath
      ? templates.length
      : selectedEntity.children?.length

    dispatch(addValue<TemplateConfig>(pathToAdd, {
      id: uuidv4(),
      name: t('explorer.levels.actionBar.template.new.title', { index }),
      type: '',
      components: [],
      children: [],
    }))

    if (selectedEntity && !expandedKeys.includes(selectedEntity.id)) {
      setExpandedKeys([...expandedKeys, selectedEntity.id])
    }
  }, [dispatch, selectedEntityPath, selectedEntity, expandedKeys, templates])

  const handleDelete = useCallback(() => {
    if (!selectedEntity || !selectedEntityPath) {
      return
    }

    dispatch(deleteValue(selectedEntityPath))
    dispatch(setValue(['levels'], filterLevels(levels, selectedEntity.id)))

    pushMessage({
      type: INSPECT_ENTITY_MSG,
      path: undefined,
    })

    const keys = getKeysToDelete(selectedEntity, type)
    setExpandedKeys(expandedKeys.filter((key) => !keys.has(key)))
  }, [dispatch, selectedEntityPath, expandedKeys, selectedEntity, type, levels])

  const handleDuplicate = useCallback(() => {
    if (selectedEntityPath === undefined) {
      return
    }

    dispatch(addValue(
      selectedEntityPath.slice(0, -1),
      duplicateTemplate(selectedEntity as TemplateConfig),
    ))
  }, [dispatch, selectedEntityPath, selectedEntity])

  return (
    <header className="levels-tree__action-bar">
      <Button
        className="levels-tree__action"
        icon={<FileAddOutlined />}
        size="small"
        onClick={handleAdd}
        title={t('explorer.levels.actionBar.addTemplate.button.title')}
      />
      <Button
        className="levels-tree__action"
        icon={<CopyOutlined />}
        size="small"
        onClick={handleDuplicate}
        title={t('explorer.levels.actionBar.duplicateTemplate.button.title')}
        disabled={type !== 'template'}
      />
      <Button
        className="levels-tree__action"
        icon={<DeleteOutlined />}
        size="small"
        onClick={handleDelete}
        title={t('explorer.levels.actionBar.deleteTemplate.button.title')}
        disabled={type !== 'template'}
      />
    </header>
  )
}

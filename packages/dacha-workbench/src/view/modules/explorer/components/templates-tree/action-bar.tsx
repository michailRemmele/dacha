import {
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

import { ActionBarStyled, ButtonCSS } from '../../explorer.style'
import { useCommander, useConfig } from '../../../../hooks'
import { addValue, deleteValue, setValue } from '../../../../commands'
import { SelectedEntityContext } from '../../../../providers'
import { duplicateTemplate } from '../../utils'

import { filterLevels } from './utils'

export const ActionBar: FC = () => {
  const { t } = useTranslation()
  const { dispatch } = useCommander()

  const { path: selectedEntityPath, type } = useContext(SelectedEntityContext)

  const templates = useConfig('templates') as Array<TemplateConfig>
  const levels = useConfig('levels') as Array<LevelConfig>
  const selectedEntity = useConfig(selectedEntityPath) as TemplateConfig | undefined

  const handleAdd = useCallback(() => {
    const pathToAdd = !selectedEntityPath || type !== 'template'
      ? ['templates']
      : selectedEntityPath.concat('children')
    const index = !selectedEntity || type !== 'template'
      ? templates.length
      : selectedEntity.children?.length

    dispatch(addValue<TemplateConfig>(pathToAdd, {
      id: uuidv4(),
      name: t('explorer.levels.actionBar.template.new.title', { index }),
      type: '',
      components: [],
      children: [],
    }))
  }, [dispatch, selectedEntityPath, selectedEntity, templates, type])

  const handleDelete = useCallback(() => {
    if (!selectedEntity || !selectedEntityPath) {
      return
    }

    dispatch(setValue(['levels'], filterLevels(levels, selectedEntity.id)))
    dispatch(deleteValue(selectedEntityPath))
  }, [dispatch, selectedEntityPath, selectedEntity, levels])

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
    <ActionBarStyled>
      <Button
        css={ButtonCSS}
        icon={<FileAddOutlined />}
        size="small"
        onClick={handleAdd}
        title={t('explorer.levels.actionBar.addTemplate.button.title')}
      />
      <Button
        css={ButtonCSS}
        icon={<CopyOutlined />}
        size="small"
        onClick={handleDuplicate}
        title={t('explorer.levels.actionBar.duplicateTemplate.button.title')}
        disabled={type !== 'template'}
      />
      <Button
        css={ButtonCSS}
        icon={<DeleteOutlined />}
        size="small"
        onClick={handleDelete}
        title={t('explorer.levels.actionBar.deleteTemplate.button.title')}
        disabled={type !== 'template'}
      />
    </ActionBarStyled>
  )
}

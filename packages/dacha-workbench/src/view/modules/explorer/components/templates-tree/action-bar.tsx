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
import type { TemplateConfig } from 'remiz'

import { ActionBarStyled, ButtonCSS } from '../../explorer.style'
import { useCommander, useConfig } from '../../../../hooks'
import { addTemplate, deleteTemplate, duplicateTemplate } from '../../../../commands/templates'
import { SelectedEntityContext } from '../../../../providers'

export const ActionBar: FC = () => {
  const { t } = useTranslation()
  const { dispatch } = useCommander()

  const { path: selectedEntityPath, type } = useContext(SelectedEntityContext)

  const templates = useConfig('templates') as Array<TemplateConfig>
  const selectedEntity = useConfig(selectedEntityPath) as TemplateConfig | undefined

  const handleAdd = useCallback(() => {
    const pathToAdd = !selectedEntityPath || type !== 'template'
      ? ['templates']
      : selectedEntityPath.concat('children')
    const index = !selectedEntity || type !== 'template'
      ? templates.length
      : selectedEntity.children?.length

    dispatch(addTemplate(pathToAdd, t('explorer.levels.actionBar.template.new.title', { index })))
  }, [dispatch, selectedEntityPath, selectedEntity, templates, type])

  const handleDelete = useCallback(() => {
    if (!selectedEntity || !selectedEntityPath) {
      return
    }

    dispatch(deleteTemplate(selectedEntityPath, selectedEntity))
  }, [dispatch, selectedEntityPath, selectedEntity])

  const handleDuplicate = useCallback(() => {
    if (selectedEntityPath === undefined) {
      return
    }

    dispatch(duplicateTemplate(selectedEntityPath.slice(0, -1), selectedEntity as TemplateConfig))
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

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

import { ActionBarStyled, ButtonCSS } from '../../explorer.style'
import { useCommander } from '../../../../hooks'
import { addTemplate, deleteTemplate, duplicateTemplate } from '../../../../commands/templates'
import { SelectedEntityContext } from '../../../../providers'

export const ActionBar: FC = () => {
  const { t } = useTranslation()
  const { dispatch } = useCommander()

  const { path: selectedEntityPath, type } = useContext(SelectedEntityContext)

  const handleAdd = useCallback(() => {
    const pathToAdd = !selectedEntityPath || type !== 'template'
      ? ['templates']
      : selectedEntityPath.concat('children')

    dispatch(addTemplate(pathToAdd))
  }, [dispatch, selectedEntityPath, type])

  const handleDelete = useCallback(() => {
    if (selectedEntityPath === undefined) {
      return
    }

    dispatch(deleteTemplate(selectedEntityPath))
  }, [dispatch, selectedEntityPath])

  const handleDuplicate = useCallback(() => {
    if (selectedEntityPath === undefined) {
      return
    }

    dispatch(duplicateTemplate(selectedEntityPath, selectedEntityPath.slice(0, -1)))
  }, [dispatch, selectedEntityPath])

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

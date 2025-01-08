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
import { InspectedEntityContext } from '../../../../providers'

export const ActionBar: FC = () => {
  const { t } = useTranslation()
  const { dispatch } = useCommander()

  const { path: inspectedEntityPath, type } = useContext(InspectedEntityContext)

  const handleAdd = useCallback(() => {
    const pathToAdd = !inspectedEntityPath || type !== 'template'
      ? ['templates']
      : inspectedEntityPath.concat('children')

    dispatch(addTemplate(pathToAdd))
  }, [dispatch, inspectedEntityPath, type])

  const handleDelete = useCallback(() => {
    if (inspectedEntityPath === undefined) {
      return
    }

    dispatch(deleteTemplate(inspectedEntityPath))
  }, [dispatch, inspectedEntityPath])

  const handleDuplicate = useCallback(() => {
    if (inspectedEntityPath === undefined) {
      return
    }

    dispatch(duplicateTemplate(inspectedEntityPath, inspectedEntityPath.slice(0, -1)))
  }, [dispatch, inspectedEntityPath])

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

import {
  useCallback,
  useContext,
  useMemo,
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
import { addScene, duplicateScene } from '../../../../commands/scenes'
import { deleteByPaths } from '../../../../commands'
import { InspectedEntityContext, EntitySelectionContext } from '../../../../providers'

interface ActionBarProps {
  isLoaders?: boolean
}

export const ActionBar: FC<ActionBarProps> = ({ isLoaders }) => {
  const { t } = useTranslation()
  const { dispatch } = useCommander()

  const translations = useMemo(
    () => {
      if (isLoaders) {
        return {
          add: 'explorer.levels.actionBar.addLoader.button.title',
          delete: 'explorer.levels.actionBar.duplicateLoader.button.title',
          duplicate: 'explorer.levels.actionBar.deleteLoader.button.title',
        }
      }
      return {
        add: 'explorer.levels.actionBar.addScene.button.title',
        delete: 'explorer.levels.actionBar.duplicateScene.button.title',
        duplicate: 'explorer.levels.actionBar.deleteScene.button.title',
      }
    },
    [isLoaders],
  )

  const { path: inspectedEntityPath, type } = useContext(InspectedEntityContext)
  const { paths: selectedEntitiesPaths } = useContext(EntitySelectionContext)

  const handleAdd = useCallback(() => {
    dispatch(addScene(isLoaders ? ['loaders'] : ['scenes']))
  }, [dispatch, isLoaders])

  const handleDelete = useCallback(() => {
    dispatch(deleteByPaths(selectedEntitiesPaths))
  }, [dispatch, selectedEntitiesPaths])

  const handleDuplicate = useCallback(() => {
    if (inspectedEntityPath === undefined) {
      return
    }

    dispatch(duplicateScene(inspectedEntityPath, inspectedEntityPath.slice(0, -1)))
  }, [dispatch, inspectedEntityPath])

  return (
    <ActionBarStyled>
      <Button
        css={ButtonCSS}
        icon={<FileAddOutlined />}
        size="small"
        onClick={handleAdd}
        title={t(translations.add)}
      />
      <Button
        css={ButtonCSS}
        icon={<CopyOutlined />}
        size="small"
        onClick={handleDuplicate}
        title={t(translations.duplicate)}
        disabled={isLoaders ? (type !== 'loader') : (type !== 'scene')}
      />
      <Button
        css={ButtonCSS}
        icon={<DeleteOutlined />}
        size="small"
        onClick={handleDelete}
        title={t(translations.delete)}
        disabled={isLoaders ? (type !== 'loader') : (type !== 'scene')}
      />
    </ActionBarStyled>
  )
}

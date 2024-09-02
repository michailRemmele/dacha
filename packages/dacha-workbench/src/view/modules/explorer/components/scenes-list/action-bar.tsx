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
import type { SceneConfig } from 'remiz'

import { ActionBarStyled, ButtonCSS } from '../../explorer.style'
import { useCommander, useConfig } from '../../../../hooks'
import { addScene, deleteScene, duplicateScene } from '../../../../commands/scenes'
import { SelectedEntityContext } from '../../../../providers'

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
          name: 'explorer.levels.actionBar.loader.new.title',
          add: 'explorer.levels.actionBar.addLoader.button.title',
          delete: 'explorer.levels.actionBar.duplicateLoader.button.title',
          duplicate: 'explorer.levels.actionBar.deleteLoader.button.title',
        }
      }
      return {
        name: 'explorer.levels.actionBar.scene.new.title',
        add: 'explorer.levels.actionBar.addScene.button.title',
        delete: 'explorer.levels.actionBar.duplicateScene.button.title',
        duplicate: 'explorer.levels.actionBar.deleteScene.button.title',
      }
    },
    [isLoaders],
  )

  const { path: selectedEntityPath, type } = useContext(SelectedEntityContext)

  const scenes = useConfig(isLoaders ? 'loaders' : 'scenes') as Array<SceneConfig>
  const selectedEntity = useConfig(selectedEntityPath) as SceneConfig | undefined

  const handleAdd = useCallback(() => {
    const pathToAdd = isLoaders ? ['loaders'] : ['scenes']
    dispatch(addScene(pathToAdd, t(translations.name, { index: scenes.length })))
  }, [dispatch, isLoaders, scenes, translations])

  const handleDelete = useCallback(() => {
    if (!selectedEntityPath) {
      return
    }

    dispatch(deleteScene(selectedEntityPath))
  }, [dispatch, selectedEntityPath])

  const handleDuplicate = useCallback(() => {
    if (selectedEntityPath === undefined) {
      return
    }

    dispatch(duplicateScene(selectedEntityPath.slice(0, -1), selectedEntity as SceneConfig))
  }, [dispatch, selectedEntityPath, selectedEntity])

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

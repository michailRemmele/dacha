import {
  useCallback,
  useContext,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'antd'
import {
  FileAddOutlined,
  FolderAddOutlined,
  DeleteOutlined,
  CopyOutlined,
} from '@ant-design/icons'
import { v4 as uuidv4 } from 'uuid'
import type { GameObjectConfig, LevelConfig } from 'remiz'

import { ActionBarStyled, ButtonCSS, AdditionalSectionStyled } from '../../explorer.style'
import { useCommander, useConfig } from '../../../../hooks'
import { addValue, deleteValue } from '../../../../commands'
import { SelectedEntityContext } from '../../../../providers'
import {
  duplicateGameObject,
  duplicateLevel,
} from '../../utils'

import { FocusActionButton } from './components'

export const ActionBar: FC = () => {
  const { t } = useTranslation()
  const { dispatch } = useCommander()

  const { path: selectedEntityPath, type } = useContext(SelectedEntityContext)

  const levels = useConfig('levels') as Array<LevelConfig>
  const selectedEntity = useConfig(selectedEntityPath) as GameObjectConfig | LevelConfig | undefined

  const handleAddGameObject = useCallback(() => {
    if (!selectedEntity || !selectedEntityPath) {
      return
    }

    const pathToAdd = selectedEntityPath.concat(type === 'level' ? 'gameObjects' : 'children')
    const index = type === 'level'
      ? (selectedEntity as LevelConfig).gameObjects?.length
      : (selectedEntity as GameObjectConfig).children?.length

    dispatch(addValue<GameObjectConfig>(pathToAdd, {
      id: uuidv4(),
      name: t('explorer.levels.actionBar.gameObject.new.title', { index }),
      components: [],
      children: [],
    }))
  }, [dispatch, selectedEntityPath, selectedEntity, type])

  const handleAddLevel = useCallback(() => {
    dispatch(addValue<LevelConfig>(['levels'], {
      id: uuidv4(),
      name: t('explorer.levels.actionBar.level.new.title', { index: levels.length }),
      gameObjects: [],
    }))
  }, [dispatch, levels])

  const handleDelete = useCallback(() => {
    dispatch(deleteValue(selectedEntityPath as Array<string>))
  }, [dispatch, selectedEntityPath])

  const handleDuplicate = useCallback(() => {
    let duplicate: GameObjectConfig | LevelConfig | undefined

    if (type === 'gameObject') {
      duplicate = duplicateGameObject(selectedEntity as GameObjectConfig)
    }
    if (type === 'level') {
      duplicate = duplicateLevel(selectedEntity as LevelConfig)
    }

    if (duplicate !== undefined && selectedEntityPath !== undefined) {
      dispatch(addValue(selectedEntityPath.slice(0, -1), duplicate))
    }
  }, [dispatch, selectedEntityPath, selectedEntity, type])

  return (
    <ActionBarStyled>
      <Button
        css={ButtonCSS}
        icon={<FileAddOutlined />}
        size="small"
        onClick={handleAddGameObject}
        title={t('explorer.levels.actionBar.addGameObject.button.title')}
        disabled={type !== 'gameObject' && type !== 'level'}
      />
      <Button
        css={ButtonCSS}
        icon={<FolderAddOutlined />}
        size="small"
        onClick={handleAddLevel}
        title={t('explorer.levels.actionBar.addLevel.button.title')}
      />
      <Button
        css={ButtonCSS}
        icon={<CopyOutlined />}
        size="small"
        onClick={handleDuplicate}
        title={
          type === 'level'
            ? t('explorer.levels.actionBar.duplicateLevel.button.title')
            : t('explorer.levels.actionBar.duplicateGameObject.button.title')
        }
        disabled={type !== 'gameObject' && type !== 'level'}
      />
      <Button
        css={ButtonCSS}
        icon={<DeleteOutlined />}
        size="small"
        onClick={handleDelete}
        title={
          type === 'level'
            ? t('explorer.levels.actionBar.deleteLevel.button.title')
            : t('explorer.levels.actionBar.deleteGameObject.button.title')
        }
        disabled={type !== 'gameObject' && type !== 'level'}
      />

      <AdditionalSectionStyled>
        <FocusActionButton
          path={type === 'gameObject' ? selectedEntityPath : undefined}
        />
      </AdditionalSectionStyled>
    </ActionBarStyled>
  )
}

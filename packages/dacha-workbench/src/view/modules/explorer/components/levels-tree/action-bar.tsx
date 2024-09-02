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
import type { ActorConfig, LevelConfig } from 'remiz'

import { ActionBarStyled, ButtonCSS, AdditionalSectionStyled } from '../../explorer.style'
import { useCommander, useConfig } from '../../../../hooks'
import { addActor, deleteActor, duplicateActor } from '../../../../commands/actors'
import { addLevel, deleteLevel, duplicateLevel } from '../../../../commands/levels'
import { SelectedEntityContext } from '../../../../providers'

import { FocusActionButton } from './components'

export const ActionBar: FC = () => {
  const { t } = useTranslation()
  const { dispatch } = useCommander()

  const { path: selectedEntityPath, type } = useContext(SelectedEntityContext)

  const levels = useConfig('levels') as Array<LevelConfig>
  const selectedEntity = useConfig(selectedEntityPath) as ActorConfig | LevelConfig | undefined

  const handleAddActor = useCallback(() => {
    if (!selectedEntity || !selectedEntityPath) {
      return
    }

    const pathToAdd = selectedEntityPath.concat(type === 'level' ? 'actors' : 'children')
    const index = type === 'level'
      ? (selectedEntity as LevelConfig).actors?.length
      : (selectedEntity as ActorConfig).children?.length

    dispatch(addActor(pathToAdd, t('explorer.levels.actionBar.actor.new.title', { index })))
  }, [dispatch, selectedEntityPath, selectedEntity, type])

  const handleAddLevel = useCallback(() => {
    dispatch(addLevel(t('explorer.levels.actionBar.level.new.title', { index: levels.length })))
  }, [dispatch, levels])

  const handleDelete = useCallback(() => {
    if (type === 'actor') {
      dispatch(deleteActor(selectedEntityPath as Array<string>))
    } else {
      dispatch(deleteLevel(selectedEntityPath as Array<string>))
    }
  }, [dispatch, selectedEntityPath, type])

  const handleDuplicate = useCallback(() => {
    if (selectedEntityPath === undefined) {
      return
    }

    const path = selectedEntityPath.slice(0, -1)

    if (type === 'actor') {
      dispatch(duplicateActor(path, selectedEntity as ActorConfig))
    } else {
      dispatch(duplicateLevel(path, selectedEntity as LevelConfig))
    }
  }, [dispatch, selectedEntityPath, selectedEntity, type])

  return (
    <ActionBarStyled>
      <Button
        css={ButtonCSS}
        icon={<FileAddOutlined />}
        size="small"
        onClick={handleAddActor}
        title={t('explorer.levels.actionBar.addActor.button.title')}
        disabled={type !== 'actor' && type !== 'level'}
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
            : t('explorer.levels.actionBar.duplicateActor.button.title')
        }
        disabled={type !== 'actor' && type !== 'level'}
      />
      <Button
        css={ButtonCSS}
        icon={<DeleteOutlined />}
        size="small"
        onClick={handleDelete}
        title={
          type === 'level'
            ? t('explorer.levels.actionBar.deleteLevel.button.title')
            : t('explorer.levels.actionBar.deleteActor.button.title')
        }
        disabled={type !== 'actor' && type !== 'level'}
      />

      <AdditionalSectionStyled>
        <FocusActionButton
          path={type === 'actor' ? selectedEntityPath : undefined}
        />
      </AdditionalSectionStyled>
    </ActionBarStyled>
  )
}

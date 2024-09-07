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

import { ActionBarStyled, ButtonCSS, AdditionalSectionStyled } from '../../explorer.style'
import { useCommander } from '../../../../hooks'
import { addActor, deleteActor, duplicateActor } from '../../../../commands/actors'
import { addLevel, deleteLevel, duplicateLevel } from '../../../../commands/levels'
import { SelectedEntityContext } from '../../../../providers'

import { FocusActionButton } from './components'

export const ActionBar: FC = () => {
  const { t } = useTranslation()
  const { dispatch } = useCommander()

  const { path: selectedEntityPath, type } = useContext(SelectedEntityContext)

  const handleAddActor = useCallback(() => {
    if (!selectedEntityPath) {
      return
    }

    const pathToAdd = selectedEntityPath.concat(type === 'level' ? 'actors' : 'children')

    dispatch(addActor(pathToAdd))
  }, [dispatch, selectedEntityPath, type])

  const handleAddLevel = useCallback(() => {
    dispatch(addLevel())
  }, [dispatch])

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

    if (type === 'actor') {
      dispatch(duplicateActor(selectedEntityPath, selectedEntityPath.slice(0, -1)))
    } else {
      dispatch(duplicateLevel(selectedEntityPath, selectedEntityPath.slice(0, -1)))
    }
  }, [dispatch, selectedEntityPath, type])

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

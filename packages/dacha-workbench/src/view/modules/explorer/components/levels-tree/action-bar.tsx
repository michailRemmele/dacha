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
import { InspectedEntityContext } from '../../../../providers'

import { FocusActionButton } from './components'

export const ActionBar: FC = () => {
  const { t } = useTranslation()
  const { dispatch } = useCommander()

  const { path: inspectedEntityPath, type } = useContext(InspectedEntityContext)

  const handleAddActor = useCallback(() => {
    if (!inspectedEntityPath) {
      return
    }

    const pathToAdd = inspectedEntityPath.concat(type === 'level' ? 'actors' : 'children')

    dispatch(addActor(pathToAdd))
  }, [dispatch, inspectedEntityPath, type])

  const handleAddLevel = useCallback(() => {
    dispatch(addLevel())
  }, [dispatch])

  const handleDelete = useCallback(() => {
    if (type === 'actor') {
      dispatch(deleteActor(inspectedEntityPath as Array<string>))
    } else {
      dispatch(deleteLevel(inspectedEntityPath as Array<string>))
    }
  }, [dispatch, inspectedEntityPath, type])

  const handleDuplicate = useCallback(() => {
    if (inspectedEntityPath === undefined) {
      return
    }

    if (type === 'actor') {
      dispatch(duplicateActor(inspectedEntityPath, inspectedEntityPath.slice(0, -1)))
    } else {
      dispatch(duplicateLevel(inspectedEntityPath, inspectedEntityPath.slice(0, -1)))
    }
  }, [dispatch, inspectedEntityPath, type])

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
          path={type === 'actor' ? inspectedEntityPath : undefined}
        />
      </AdditionalSectionStyled>
    </ActionBarStyled>
  )
}

import {
  useCallback,
  useContext,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'antd'
import {
  FilePlus,
  FolderPlus,
} from '@gravity-ui/icons'

import { ActionBarStyled, ButtonCSS, AdditionalSectionStyled } from '../../explorer.style'
import { useCommander } from '../../../../hooks'
import { addActor, addScene } from '../../../../commands/scenes'
import { InspectedEntityContext } from '../../../../providers'
import { HotkeysBar, Icon } from '../../../../components'

import { FocusActionButton } from './components'

export const ActionBar: FC = () => {
  const { t } = useTranslation()
  const { dispatch } = useCommander()

  const { path: inspectedEntityPath, type } = useContext(InspectedEntityContext)

  const handleAddActor = useCallback(() => {
    if (!inspectedEntityPath) {
      return
    }

    const pathToAdd = inspectedEntityPath.concat(type === 'scene' ? 'actors' : 'children')

    dispatch(addActor(pathToAdd))
  }, [dispatch, inspectedEntityPath, type])

  const handleAddScene = useCallback(() => {
    dispatch(addScene())
  }, [dispatch])

  return (
    <ActionBarStyled>
      <Button
        css={ButtonCSS}
        icon={<Icon icon={<FilePlus />} />}
        size="small"
        onClick={handleAddActor}
        title={t('explorer.scenes.actionBar.addActor.button.title')}
        disabled={type !== 'actor' && type !== 'scene'}
      />
      <Button
        css={ButtonCSS}
        icon={<Icon icon={<FolderPlus />} />}
        size="small"
        onClick={handleAddScene}
        title={t('explorer.scenes.actionBar.addScene.button.title')}
      />

      <AdditionalSectionStyled>
        <HotkeysBar />
      </AdditionalSectionStyled>

      <AdditionalSectionStyled>
        <FocusActionButton
          path={type === 'actor' ? inspectedEntityPath : undefined}
        />
      </AdditionalSectionStyled>
    </ActionBarStyled>
  )
}

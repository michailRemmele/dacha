import {
  useEffect,
  useCallback,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from 'antd'
import { v4 as uuidv4 } from 'uuid'

import { useConfig, useCommander } from '../../../../../hooks'
import { addValue } from '../../../../../commands'
import { getUniqueName } from '../../../../../../utils/get-unique-name'
import { CollapsePanel } from '../../../components/collapse-panel'
import type { AudioGroup } from '../../types/audio-system'

import {
  GroupsStyled,
  ButtonCSS,
} from './audio-groups.style'
import { AudioGroup as AudioGroupPanel } from './audio-group'
import { PATH } from './consts'

export const AudioGroupsWidget: FC = () => {
  const { t } = useTranslation()
  const { dispatch } = useCommander()

  const groups = useConfig(PATH) as AudioGroup[] | undefined

  useEffect(() => {
    if (groups) {
      return
    }

    dispatch(addValue(['globalOptions'], {
      name: 'audioGroups',
      options: {
        groups: [],
      },
    }))
  }, [groups])

  const handleAddNewGroup = useCallback(() => {
    if (!groups) {
      return
    }

    dispatch(addValue<AudioGroup>(PATH, {
      id: uuidv4(),
      name: getUniqueName('bus', groups),
      volume: 1,
    }))
  }, [dispatch, groups])

  return (
    <CollapsePanel
      title={t('globalOptions.audioGroups.title')}
      deletable={false}
    >
      <GroupsStyled>
        {groups?.map(({ id }) => (
          <AudioGroupPanel key={id} id={id} />
        ))}
      </GroupsStyled>
      <Button
        css={ButtonCSS}
        size="small"
        onClick={handleAddNewGroup}
      >
        {t('globalOptions.audioGroups.addNew.title')}
      </Button>
    </CollapsePanel>
  )
}

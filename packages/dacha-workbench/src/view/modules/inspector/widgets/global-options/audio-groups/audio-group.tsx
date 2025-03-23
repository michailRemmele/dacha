import {
  useMemo,
  useCallback,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'

import { LabelledTextInput } from '../../../components/text-input'
import { LabelledRangeInput } from '../../../components/range-input'
import { Field } from '../../../components/field'
import { Panel } from '../../../components/panel'
import { useCommander } from '../../../../../hooks'
import { deleteValue } from '../../../../../commands'

import {
  PanelCSS,
} from './audio-groups.style'
import { PATH } from './consts'

export interface AudioGroupProps {
  id: string
}

export const AudioGroup: FC<AudioGroupProps> = ({ id }) => {
  const { t } = useTranslation()
  const { dispatch } = useCommander()

  const groupPath = useMemo(() => PATH.concat(`id:${id}`), [PATH])
  const namePath = useMemo(() => groupPath.concat('name'), [groupPath])
  const volumePath = useMemo(() => groupPath.concat('volume'), [groupPath])

  const handleDeleteBind = useCallback(() => {
    dispatch(deleteValue(groupPath))
  }, [dispatch, groupPath])

  return (
    <Panel
      css={PanelCSS}
      title={t('globalOptions.audioGroups.panel.name.title')}
      onDelete={handleDeleteBind}
    >
      <Field
        path={namePath}
        component={LabelledTextInput}
        label={t('globalOptions.audioGroups.name.title')}
      />
      <Field
        path={volumePath}
        component={LabelledRangeInput}
        label={t('globalOptions.audioGroups.volume.title')}
        min={0}
        max={1}
        step={0.01}
      />
    </Panel>
  )
}

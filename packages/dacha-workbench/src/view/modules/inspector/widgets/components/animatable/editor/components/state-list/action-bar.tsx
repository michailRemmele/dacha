import {
  useCallback,
  useContext,
  useMemo,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import {
  Plus,
  CirclePlus,
  CircleChevronRight,
} from '@gravity-ui/icons'
import type { Animation } from 'dacha'

import { getStatePath } from '../../utils/paths'
import * as editorStyles from '../../editor.module.css'
import { useConfig, useCommander } from '../../../../../../../../hooks'
import { HotkeysBar, Icon, IconButton } from '../../../../../../../../components'
import { AnimationEditorContext } from '../../providers'
import { addState, addSubstate, setInitialState } from '../../commands/states'

export const ActionBar: FC = () => {
  const { t } = useTranslation()
  const { dispatch } = useCommander()
  const {
    path,
    inspectedEntity,
  } = useContext(AnimationEditorContext)

  const statePath = inspectedEntity ? getStatePath(inspectedEntity.path) : undefined

  const statesPath = useMemo(() => path.concat('states'), [path])
  const substatesPath = useMemo(
    () => statePath && statePath.concat('substates'),
    [statePath],
  )

  const selectedStateConfig = useConfig(statePath) as Animation.StateConfig | undefined

  const handleAddSubstate = useCallback(() => {
    dispatch(addSubstate(substatesPath as string[]))
  }, [dispatch, substatesPath])

  const handleAddState = useCallback(() => {
    dispatch(addState(statesPath))
  }, [dispatch, statesPath])

  const handleInitialSet = useCallback(() => {
    dispatch(setInitialState(statePath as string[]))
  }, [dispatch, statePath])

  return (
    <header className={editorStyles.actionBar}>
      <IconButton
        icon={<Icon icon={<Plus />} />}
        onClick={handleAddState}
        title={t('components.animatable.editor.state.add.button.title')}
      />
      <IconButton
        icon={<Icon icon={<CirclePlus />} />}
        onClick={handleAddSubstate}
        title={t('components.animatable.editor.substate.add.button.title')}
        disabled={(inspectedEntity?.type !== 'state' || selectedStateConfig?.type !== 'group') && inspectedEntity?.type !== 'substate'}
      />
      <IconButton
        icon={<Icon icon={<CircleChevronRight />} />}
        onClick={handleInitialSet}
        title={t('components.animatable.editor.state.setInitial.button.title')}
        disabled={inspectedEntity?.type !== 'state'}
      />

      <div className={editorStyles.actionDivider} />

      <HotkeysBar />
    </header>
  )
}

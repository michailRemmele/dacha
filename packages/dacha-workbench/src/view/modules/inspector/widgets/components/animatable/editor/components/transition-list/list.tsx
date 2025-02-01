import {
  useCallback,
  useContext,
  useMemo,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import type { Animation } from 'dacha'

import { getStatePath } from '../../utils/paths'
import { getIdByPath } from '../../../../../../../../../utils/get-id-by-path'
import { TreeCSS } from '../../editor.style'
import { useConfig } from '../../../../../../../../hooks'
import { Tree } from '../../../../../../../../components'
import { AnimationEditorContext } from '../../providers'
import { CHILDREN_FIELD_MAP } from '../../const'

import { parseTransitions, getSelectedPaths } from './utils'

export const List: FC = () => {
  const { t } = useTranslation()
  const {
    path,
    inspectedEntity,
    inspectEntity,
    entitySelection,
    selectEntities,
  } = useContext(AnimationEditorContext)

  const statePath = getStatePath(inspectedEntity?.path as string[]) as string[]
  const transitionPath = inspectedEntity?.type === 'transition' ? inspectedEntity.path : undefined

  const statesPath = useMemo(() => path.concat('states'), [path])
  const transitionsPath = useMemo(() => statePath.concat('transitions'), [statePath])

  const statesConfigs = useConfig(statesPath) as Array<Animation.StateConfig>
  const stateConfig = useConfig(statePath) as Animation.StateConfig
  const transitions = useConfig(transitionsPath) as Array<Animation.TransitionConfig>

  const statesNames = useMemo(() => statesConfigs.reduce((acc, item) => {
    acc[item.id] = item.name
    return acc
  }, {} as Record<string, string>), [statesConfigs])

  const treeData = useMemo(
    () => parseTransitions(
      transitions,
      statePath,
      stateConfig.name,
      statesNames,
      t('components.animatable.editor.transition.unknown.state.title'),
    ),
    [transitions, statePath, stateConfig, statesNames],
  )

  const handleInspect = useCallback((entityPath: string[] | undefined) => {
    inspectEntity(entityPath)
  }, [inspectEntity])
  const handleSelect = useCallback((paths: string[][]) => {
    selectEntities(paths)
  }, [selectEntities])
  const handleClickOutside = useCallback(() => {
    if (inspectedEntity?.type === 'transition') {
      selectEntities([])
      inspectEntity(undefined)
    }
  }, [inspectedEntity])

  return (
    <Tree
      css={TreeCSS}
      treeData={treeData}
      selectedPaths={getSelectedPaths(entitySelection.paths)}
      inspectedKey={transitionPath ? getIdByPath(transitionPath) : undefined}
      childrenFieldMap={CHILDREN_FIELD_MAP}
      onInspect={handleInspect}
      onSelect={handleSelect}
      onClickOutside={handleClickOutside}
      showIcon={false}
    />
  )
}

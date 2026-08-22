import {
  useCallback,
  useContext,
  useMemo,
  FC,
} from 'react'
import { useTranslation } from 'react-i18next'
import type { Animation } from 'dacha'

import { getStatePath, getSubstatePath } from '../../utils/paths'
import { getIdByPath } from '../../../../../../../../../utils/get-id-by-path'
import { useConfig } from '../../../../../../../../hooks'
import { AnimationEditorContext } from '../../providers'
import { Tree } from '../../../../../../../../components'
import { CHILDREN_FIELD_MAP } from '../../const'

import { cx } from '../../../../../../../../../utils/cx'

import editorStyles from '../../editor.module.css'
import styles from './state-list.module.css'
import { parseStates, getSelectedPaths } from './utils'

export interface StateListProps {
  onDrop?: (sourcePaths: string[][], destinationPath: string[]) => void
}

export const List: FC<StateListProps> = ({ onDrop }) => {
  const { t } = useTranslation()
  const {
    path,
    inspectedEntity,
    inspectEntity,
    selectEntities,
    entitySelection,
  } = useContext(AnimationEditorContext)

  const statePath = inspectedEntity ? getStatePath(inspectedEntity.path) : undefined
  const substatePath = inspectedEntity ? getSubstatePath(inspectedEntity.path) : undefined

  const initialStatePath = useMemo(() => path.concat('initialState'), [path])
  const statesPath = useMemo(() => path.concat('states'), [path])

  const initialState = useConfig(initialStatePath) as string

  const states = useConfig(statesPath) as Animation.StateConfig[]

  const treeData = useMemo(() => parseStates(
    states,
    path,
    initialState,
    t('components.animatable.editor.state.initial.title'),
  ), [states, initialState, path])

  const handleInspect = useCallback((entityPath: string[] | undefined) => {
    inspectEntity(entityPath)
  }, [inspectEntity])
  const handleSelect = useCallback((paths: string[][]) => {
    selectEntities(paths)
  }, [selectEntities])
  const handleClickOutside = useCallback(() => {
    if (inspectedEntity?.type === 'state' || inspectedEntity?.type === 'substate') {
      selectEntities([])
      inspectEntity(undefined)
    }
  }, [inspectedEntity])

  const selectedPath = substatePath ?? statePath
  const selectedKey = selectedPath ? getIdByPath(selectedPath) : undefined
  const inspectedKey = inspectedEntity?.path ? getIdByPath(inspectedEntity?.path) : undefined
  const isInactive = selectedKey !== inspectedKey

  return (
    <Tree
      className={cx(editorStyles.tree, styles.tree, isInactive && styles.treeInactive)}
      treeData={treeData}
      selectedPaths={getSelectedPaths(entitySelection.paths, inspectedEntity)}
      inspectedKey={selectedKey}
      childrenFieldMap={CHILDREN_FIELD_MAP}
      onInspect={handleInspect}
      onSelect={handleSelect}
      onClickOutside={handleClickOutside}
      showIcon={false}
      draggable
      onDrop={onDrop}
    />
  )
}

import {
  useContext,
  useRef,
  useEffect,
} from 'react'
import type { FC, MouseEvent } from 'react'
import type { Animation } from 'dacha'

import { HotkeysSectionContext } from '../../../../../../../../providers'
import { getIdByPath } from '../../../../../../../../../utils/get-id-by-path'
import { getStatePath, getSubstatePath } from '../../utils/paths'
import { AnimationEditorContext } from '../../providers'
import { useConfig } from '../../../../../../../../hooks'

import { getSelectedPaths, getFramesPath, getParentId } from './utils'
import { Frame } from './frame'
import { ListStyled, ListItemStyled } from './timeline.style'

export const List: FC = () => {
  const {
    inspectedEntity,
    inspectEntity,
    entitySelection,
    selectEntities,
  } = useContext(AnimationEditorContext)
  const { clipboard, isCut } = useContext(HotkeysSectionContext)

  const lastSelectedKey = useRef<string>()
  const lastSelectedKeys = useRef<string[]>([])

  const selectedPaths = getSelectedPaths(entitySelection.paths)
  const selectedIds = selectedPaths.map((path) => getIdByPath(path))
  const cutIds = isCut ? clipboard?.map((path) => getIdByPath(path)) : undefined

  const statePath = getStatePath(inspectedEntity?.path as string[]) as string[]
  const substatePath = getSubstatePath(inspectedEntity?.path as string[])

  const state = useConfig(statePath) as Animation.StateConfig

  const framesPath = getFramesPath(state, statePath, substatePath)
  const frames = useConfig(framesPath) as Array<Animation.FrameConfig> | undefined

  useEffect(() => {
    lastSelectedKey.current = undefined
    lastSelectedKeys.current = []
  }, [getParentId(framesPath)])

  const handleSelect = (key: string, event: MouseEvent): void => {
    if (!framesPath || !frames) {
      return
    }

    const ctrlPick = event.ctrlKey || event?.metaKey
    const shiftPick = event?.shiftKey

    const keys = frames.map((frame) => frame.id)
    const selectedKeysSet = new Set(selectedIds)

    if (ctrlPick) {
      if (selectedKeysSet.has(key)) {
        selectedKeysSet.delete(key)
      } else {
        selectedKeysSet.add(key)
      }

      lastSelectedKeys.current = Array.from(selectedKeysSet)
      lastSelectedKey.current = key
    } else if (shiftPick) {
      if (!lastSelectedKey.current) {
        return
      }

      selectedKeysSet.clear()

      const startIndex = keys.indexOf(lastSelectedKey.current)
      const endIndex = keys.indexOf(key)

      const newSelectedKeys = [
        ...lastSelectedKeys.current,
        ...keys.slice(
          Math.min(startIndex, endIndex),
          Math.max(startIndex, endIndex) + 1,
        ),
      ]
      newSelectedKeys.forEach((id) => selectedKeysSet.add(id))
    } else {
      selectedKeysSet.clear()
      selectedKeysSet.add(key)

      lastSelectedKeys.current = Array.from(selectedKeysSet)
      lastSelectedKey.current = key
    }

    const newSelectedPaths = Array.from(selectedKeysSet).map((id) => framesPath.concat(`id:${id}`))

    selectEntities(newSelectedPaths)
    inspectEntity(newSelectedPaths[0])
  }
  const handleClick = (event: React.MouseEvent<HTMLUListElement>): void => {
    if (event.target === event.currentTarget && inspectedEntity?.type === 'frame') {
      selectEntities([])
      inspectEntity(undefined)
    }
  }

  return (
    <ListStyled onClick={handleClick}>
      {frames?.map(({ id }, index) => (
        <ListItemStyled key={id}>
          <Frame
            id={id}
            title={String(index)}
            onSelect={handleSelect}
            isSelected={selectedIds.includes(id)}
            isCut={cutIds?.includes(id)}
          />
        </ListItemStyled>
      ))}
    </ListStyled>
  )
}

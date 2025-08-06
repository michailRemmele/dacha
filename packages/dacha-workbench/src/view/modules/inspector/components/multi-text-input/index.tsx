import {
  useCallback,
  useState,
  FC,
} from 'react'
import { Select as AntdSelect } from 'antd'
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
} from '@dnd-kit/sortable'

import { Labelled, LabelledProps } from '../labelled'
import type { MultiTextInputProps } from '../../../../../types/inputs'

import { SelectCSS } from './multi-text-input.style'
import { Tag } from './tag'
import { DraggableTag } from './draggable-tag'
import { keyboardCoordinatesGetter } from './keyboard-sensor'

const disableSortingStrategy = (): null => null

export const MultiTextInput: FC<MultiTextInputProps> = ({
  onChange = (): void => void 0,
  onBlur = (): void => void 0,
  onAccept = (): void => void 0,
  defaultValue,
  onSelect,
  value,
  ...props
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: keyboardCoordinatesGetter,
    }),
  )

  const [activeTag, setActiveTag] = useState<string | null>()
  // Drag action leads to issues with input focus, so select should been reloaded
  const [forceReload, setForceReload] = useState(false)

  const handleChange = useCallback((values: string[]) => onChange(values), [onChange])

  const handleDeselect = useCallback(() => {
    onAccept()
  }, [onAccept])

  const handleBlur = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    onAccept()
    onBlur(event)
  }, [onBlur, onAccept])

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveTag(value.find((tag) => tag === event.active.id))
  }, [value])

  const handleDragEnd = useCallback(() => {
    setActiveTag(null)
    onAccept()
    setForceReload(!forceReload)
  }, [onAccept, forceReload])

  const handleDragOver = useCallback((event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over?.id) {
      return
    }

    const activeTagIndex = value.findIndex((tag) => tag === active.id)
    const overTagIndex = value.findIndex((tag) => tag === over.id)

    onChange(arrayMove(value, activeTagIndex, overTagIndex))
  }, [value, onChange])

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragCancel={handleDragEnd}
    >
      <SortableContext items={value} strategy={disableSortingStrategy}>
        <AntdSelect
          key={String(forceReload)}
          css={SelectCSS}
          tokenSeparators={[' ', ',']}
          size="small"
          mode="tags"
          onChange={handleChange}
          onDeselect={handleDeselect}
          onBlur={handleBlur}
          tagRender={DraggableTag}
          showArrow={false}
          open={false}
          value={value}
          {...props}
        />
      </SortableContext>
      <DragOverlay>
        {activeTag ? <Tag value={activeTag} /> : null}
      </DragOverlay>
    </DndContext>
  )
}

export const LabelledMultiTextInput: FC<MultiTextInputProps & Omit<LabelledProps, 'children'>> = ({ label, ...props }) => (
  <Labelled label={label}>
    <MultiTextInput {...props} />
  </Labelled>
)

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { Tag } from './tag'
import type { TagProps } from './tag'

const ACTIVE_ENTITY_OPACITY = 0.5

export const DraggableTag = ({ value, onClose }: TagProps): JSX.Element => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: value })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? ACTIVE_ENTITY_OPACITY : undefined,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
    >
      <Tag
        value={value}
        onClose={onClose}
        {...attributes}
        {...listeners}
      />
    </div>
  )
}

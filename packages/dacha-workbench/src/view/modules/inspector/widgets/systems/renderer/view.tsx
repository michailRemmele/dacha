import { useMemo, useCallback, useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';

import type { WidgetProps } from '../../../../../../types/widget-schema';
import { Widget } from '../../../components/widget';
import { EntityMultiselect } from '../../../components/entity-picker';
import { useConfig, useCommander, useBehaviors } from '../../../../../hooks';
import { addValue, setValue } from '../../../../../commands';

import { DraggableEffectPanel } from './draggable-effect-panel';
import { DragOverlayEntry } from './drag-overlay-entry';
import { BEHAVIOR_TYPE } from './consts';
import {
  RendererStyled,
  EntityPickerCSS,
  SectionHeaderStyled,
} from './renderer.style';

interface FilterEffectEntry {
  id: string;
  name: string;
  options: Record<string, unknown>;
}

export const RendererWidget: FC<WidgetProps> = ({ path, fields }) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const { t } = useTranslation();
  const { dispatch } = useCommander();

  const effects = useBehaviors(BEHAVIOR_TYPE);

  const [activeEntry, setActiveEntry] = useState<FilterEffectEntry | null>();

  const filterEffectsPath = useMemo(
    () => path.concat('filterEffects'),
    [path],
  );

  const selectedEffects =
    (useConfig(filterEffectsPath) as FilterEffectEntry[] | undefined) ?? [];

  const effectsIds = useMemo(
    () => selectedEffects.map((effect) => effect.id),
    [selectedEffects],
  );

  const availableEffects = useMemo(() => {
    return Object.keys(effects ?? {}).map((key) => ({
      label: key,
      value: key,
    }));
  }, [effects]);

  const handleAddEffect = useCallback(
    (name: string) => {
      dispatch(
        addValue(filterEffectsPath, {
          id: uuidv4(),
          name,
          options: effects?.[name].getInitialState?.() ?? {},
        }),
      );
    },
    [dispatch, filterEffectsPath, effects],
  );

  const handleCreate = useCallback((name: string, filepath: string) => {
    window.electron.createBehavior(name, filepath, BEHAVIOR_TYPE);
  }, []);

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      setActiveEntry(
        selectedEffects.find((entry) => entry.id === event.active.id),
      );
    },
    [selectedEffects, dispatch, filterEffectsPath],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      setActiveEntry(null);

      if (!over || active.id === over?.id) {
        return;
      }

      const activeEntryIndex = selectedEffects.findIndex(
        (entry) => entry.id === active.id,
      );
      const overEntryIndex = selectedEffects.findIndex(
        (entry) => entry.id === over.id,
      );

      dispatch(
        setValue(
          filterEffectsPath,
          arrayMove(selectedEffects, activeEntryIndex, overEntryIndex),
        ),
      );
    },
    [selectedEffects],
  );

  return (
    <RendererStyled>
      {fields?.length ? <Widget fields={fields} path={path} /> : null}

      <SectionHeaderStyled>
        {t('systems.renderer.filterEffect.title')}
      </SectionHeaderStyled>

      <div>
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={effectsIds}
            strategy={verticalListSortingStrategy}
          >
            {selectedEffects.map(({ id, name }) => (
              <DraggableEffectPanel
                key={id}
                id={id}
                path={filterEffectsPath}
                schema={effects?.[name]}
              />
            ))}
          </SortableContext>
          <DragOverlay>
            {activeEntry ? (
              <DragOverlayEntry
                id={activeEntry.id}
                path={filterEffectsPath}
                schema={effects?.[activeEntry.name]}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      <EntityMultiselect
        css={EntityPickerCSS}
        size="small"
        placeholder={t('systems.renderer.filterEffect.addNew.title')}
        options={availableEffects}
        type={BEHAVIOR_TYPE}
        onAdd={handleAddEffect}
        onCreate={handleCreate}
      />
    </RendererStyled>
  );
};

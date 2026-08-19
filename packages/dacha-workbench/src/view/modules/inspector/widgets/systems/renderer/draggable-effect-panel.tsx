import { FC } from 'react';
import { Grip } from '@gravity-ui/icons';
import { Icon } from '../../../../../components';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import styles from './renderer.module.css';
import { EffectPanel, type EffectPanelProps } from './effect-panel';

const ACTIVE_ENTRY_OPACITY = 0.5;

type WithDraggableFn = (
  Component: FC<EffectPanelProps>,
) => FC<EffectPanelProps>;

const withDraggable: WithDraggableFn = (Component) => {
  const WrappedComponent: FC<EffectPanelProps> = (props) => {
    const { id } = props;

    const { attributes, listeners, setNodeRef, transform, transition, active } =
      useSortable({ id: id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      ...(active?.id === id && { opacity: ACTIVE_ENTRY_OPACITY }),
    };

    return (
      <div ref={setNodeRef} style={style}>
        <Component
          extra={
            <Icon
              className={styles.holder}
              icon={<Grip />}
              {...attributes}
              {...listeners}
            />
          }
          {...props}
        />
      </div>
    );
  };

  return WrappedComponent;
};

export const DraggableEffectPanel = withDraggable(EffectPanel);

import { forwardRef } from 'react';
import { Grip } from '@gravity-ui/icons';
import { Icon } from '../../../../../components';

import { DragOverlayStyled, HolderOutlinedCSS } from './renderer.style';
import { EffectPanel, type EffectPanelProps } from './effect-panel';

export const DragOverlayEntry = forwardRef<HTMLDivElement, EffectPanelProps>(
  (props, ref) => (
    <DragOverlayStyled ref={ref}>
      <EffectPanel
        extra={<Icon css={HolderOutlinedCSS} icon={<Grip />} />}
        {...props}
      />
    </DragOverlayStyled>
  ),
);

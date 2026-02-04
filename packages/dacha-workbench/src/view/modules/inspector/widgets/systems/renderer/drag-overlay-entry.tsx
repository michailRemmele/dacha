import { forwardRef } from 'react';
import { HolderOutlined } from '@ant-design/icons';

import { DragOverlayStyled, HolderOutlinedCSS } from './renderer.style';
import { EffectPanel, type EffectPanelProps } from './effect-panel';

export const DragOverlayEntry = forwardRef<HTMLDivElement, EffectPanelProps>(
  (props, ref) => (
    <DragOverlayStyled ref={ref}>
      <EffectPanel
        extra={<HolderOutlined css={HolderOutlinedCSS} />}
        {...props}
      />
    </DragOverlayStyled>
  ),
);

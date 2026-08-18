import type { FC, ReactNode, ReactElement } from 'react';
import { Button } from 'antd';
import { TrashBin } from '@gravity-ui/icons';
import { Icon } from '../../../../components';

import {
  PanelStyled,
  HeadingStyled,
  PanelContentStyled,
  ButtonSmallCSS,
} from './panel.style';

export interface PanelProps {
  children:
    ReactElement | (ReactElement | null | undefined)[] | null | undefined;
  title: string;
  onDelete?: () => void;
  extra?: ReactNode;
  size?: 'small' | 'middle';
  className?: string;
}

export const Panel: FC<PanelProps> = ({
  children,
  title,
  onDelete,
  extra,
  size = 'middle',
  className,
}) => (
  <PanelStyled size={size} className={className}>
    <HeadingStyled size={size} contentless={!children}>
      {extra}

      <span>{title}</span>

      {onDelete ? (
        <>
          {size === 'middle' ? (
            <Button icon={<Icon icon={<TrashBin />} />} onClick={onDelete} />
          ) : null}
          {size === 'small' ? (
            <Button
              css={ButtonSmallCSS}
              style={{ width: '18px', height: '18px' }}
              type="text"
              icon={<Icon icon={<TrashBin />} />}
              onClick={onDelete}
            />
          ) : null}
        </>
      ) : null}
    </HeadingStyled>
    {children ? (
      <PanelContentStyled size={size}>{children}</PanelContentStyled>
    ) : null}
  </PanelStyled>
);

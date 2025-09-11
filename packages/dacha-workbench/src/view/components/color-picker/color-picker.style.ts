import styled from '@emotion/styled';
import { css, useTheme } from '@emotion/react';
import type { SerializedStyles } from '@emotion/react';

interface ColorStyledProps {
  color: string;
}

export const ColorStyled = styled.span<ColorStyledProps>(
  ({ color, theme }) => css`
    width: 100%;
    height: 100%;

    background-color: ${color};

    border: 1px solid ${theme.colorFillSecondary};
    border-radius: ${theme.borderRadiusXS}px;
  `,
);

export const ColorButtonCSS = (isOpen: boolean): SerializedStyles => {
  const theme = useTheme();
  return css`
    display: flex;
    align-items: center;

    width: 21px;

    &.ant-btn {
      padding: 3px;
    }

    ${isOpen &&
    css`
      border-color: ${theme.colorPrimaryHover};
      box-shadow: 0 0 0 ${theme.controlOutlineWidth}px ${theme.controlOutline};
    `}
  `;
};

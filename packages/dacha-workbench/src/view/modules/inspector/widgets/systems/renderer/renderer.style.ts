import styled from '@emotion/styled';
import { css, useTheme } from '@emotion/react';
import type { SerializedStyles } from '@emotion/react';

export const RendererStyled = styled.div`
  margin: 5px 0;
`;

export const EffectFormStyled = styled.div`
  text-align: center;
`;

export const SectionHeaderStyled = styled.span`
  display: block;
  margin: 5px 0;
`;

export const PanelCSS = (noSchema: boolean): SerializedStyles => {
  const theme = useTheme();
  return css`
    ${noSchema &&
    css`
      box-shadow: 0 0 0 2px ${theme.colorError};
      background-color: ${theme.colorErrorBg};
    `}

    margin-bottom: 5px;
  `;
};

export const EntityPickerCSS = css`
  margin-top: 10px;
`;

export const HolderOutlinedCSS = (): SerializedStyles => {
  const theme = useTheme();
  return css`
    padding: 2px 1px;
    border-radius: 3px;

    margin-right: 3px;

    &:hover {
      background-color: ${theme.colorBorderSecondary};

      cursor: grab;
    }
  `;
};

export const DragOverlayStyled = styled.div(
  ({ theme }) => css`
    background-color: ${theme.colorBgContainer};
    border-radius: ${theme.borderRadiusLG}px;
  `,
);

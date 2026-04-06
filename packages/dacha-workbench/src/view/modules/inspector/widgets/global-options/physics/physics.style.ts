import styled from '@emotion/styled';
import { css } from '@emotion/react';

export const SectionHeaderStyled = styled.span`
  display: block;
  margin: 5px 0;
`;

export const LayersStyled = styled.div`
  margin-bottom: 5px;
`;

export const EmptyPlaceholderStyled = styled.div`
  padding: 10px 0;
  text-align: center;
`;

export const ButtonCSS = css`
  width: 100%;
  margin: 5px 0;
`;

export const RemoveButtonCSS = css`
  flex-shrink: 0;
`;

export const LayerStyled = styled.div`
  display: flex;
  align-items: center;

  margin: 5px 0;
`;

export const FieldWrapperStyled = styled.div`
  width: 100%;
  margin: 0 5px;

  & label {
    margin: 0;
  }
`;

export const MatrixStyled = styled.div<{
  size: number;
}>(
  ({ size }) => css`
    display: grid;
    grid-template-columns: max-content repeat(${size}, 20px);
    margin: 10px 5px;
    max-width: 100%;
    overflow: auto;
  `,
);

export const MatrixRowStyled = styled.div`
  display: contents;
`;

export const MatrixHeaderRowStyled = styled.div`
  display: contents;
`;

export const MatrixLabelStyled = styled.div`
  padding-right: 8px;

  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export const MatrixHeaderLabelStyled = styled(MatrixLabelStyled)`
  padding-right: 0px;
  padding-bottom: 8px;

  writing-mode: vertical-rl;
`;

export const MatrixCellStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const MatrixSpacerCellStyled = styled(MatrixCellStyled)`
  visibility: hidden;
`;

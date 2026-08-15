import styled from '@emotion/styled';

export const IconStyled = styled.span<{ size: number }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${({ size }): number => size}px;
  height: ${({ size }): number => size}px;
  line-height: 0;
  flex-shrink: 0;
  vertical-align: -0.225em;

  & > svg {
    display: block;
    width: ${({ size }): number => size}px;
    height: ${({ size }): number => size}px;
  }
`;

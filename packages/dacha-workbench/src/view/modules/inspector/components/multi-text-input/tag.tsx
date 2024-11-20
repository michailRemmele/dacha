import { CloseOutlined } from '@ant-design/icons'

import { TagStyled, TagTextStyled, CloseIconStyled } from './multi-text-input.style'

export interface TagProps {
  value: string
  onClose?: () => void
}

export const Tag = ({ value, onClose, ...props }: TagProps): JSX.Element => (
  <TagStyled title={value}>
    <TagTextStyled {...props}>
      {value}
    </TagTextStyled>
    <CloseIconStyled>
      <CloseOutlined width="1em" height="1em" onClick={onClose} />
    </CloseIconStyled>
  </TagStyled>
)

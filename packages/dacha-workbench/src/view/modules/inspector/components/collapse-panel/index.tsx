import {
  useCallback,
  useState,
  useRef,
  FC,
} from 'react'
import { Collapse } from 'antd'

import { PanelExtra } from './panel-extra'
import { PanelHeader } from './panel-header'
import { PanelExpand } from './panel-expand'

import { CollapseCSS } from './collapse-panel.style'

type ExpandIcon = FC<{
  isActive?: boolean
}>

export interface CollapsePanelProps {
  children: JSX.Element | (JSX.Element | null)[] | string | null
  title: string
  onDelete?: (event: React.MouseEvent<HTMLElement>) => void
  expandExtra?: JSX.Element | JSX.Element[]
  deletable?: boolean
  className?: string
}

export const CollapsePanel: FC<CollapsePanelProps> = ({
  children,
  title,
  onDelete,
  expandExtra,
  deletable = true,
  className,
}) => {
  const ignoreRef = useRef(false)
  const [activeKey, setActiveKey] = useState<string | string[]>()

  const expandIcon = useCallback<ExpandIcon>(({ isActive }) => (
    <PanelExpand isActive={isActive}>{expandExtra}</PanelExpand>
  ), [expandExtra])

  const handleChange = useCallback((key: string | string[]): void => {
    if (ignoreRef.current) {
      ignoreRef.current = false
    } else {
      setActiveKey(key)
    }
  }, [])

  const handleDelete = useCallback((event: React.MouseEvent<HTMLElement>): void => {
    ignoreRef.current = true
    onDelete?.(event)
  }, [onDelete])

  return (
    <Collapse
      css={CollapseCSS}
      className={className}
      activeKey={activeKey}
      onChange={handleChange}
      expandIcon={expandIcon}
    >
      <Collapse.Panel
        header={<PanelHeader title={title} />}
        extra={deletable ? <PanelExtra onDelete={handleDelete} /> : undefined}
        key={title}
      >
        {children}
      </Collapse.Panel>
    </Collapse>
  )
}

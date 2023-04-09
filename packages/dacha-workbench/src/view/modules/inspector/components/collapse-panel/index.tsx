import React, {
  useCallback,
  useState,
  useRef,
  FC,
} from 'react'
import { Collapse } from 'antd'

import { PanelExtra } from './panel-extra'
import { PanelHeader } from './panel-header'
import { PanelExpand } from './panel-expand'

import './style.less'

type ExpandIcon = FC<{
  isActive?: boolean
}>

export interface CollapsePanelProps {
  children: JSX.Element | Array<JSX.Element | null> | string | null
  title: string
  onDelete: (event: React.MouseEvent<HTMLElement>) => void
  expandExtra?: JSX.Element | Array<JSX.Element>
}

export const CollapsePanel: FC<CollapsePanelProps> = ({
  children,
  title,
  onDelete,
  expandExtra,
}) => {
  const ignoreRef = useRef(false)
  const [activeKey, setActiveKey] = useState<string | Array<string>>()

  const expandIcon = useCallback<ExpandIcon>(({ isActive }) => (
    <PanelExpand isActive={isActive}>{expandExtra}</PanelExpand>
  ), [expandExtra])

  const handleChange = useCallback((key: string | Array<string>): void => {
    if (ignoreRef.current) {
      ignoreRef.current = false
    } else {
      setActiveKey(key)
    }
  }, [])

  const handleDelete = useCallback((event: React.MouseEvent<HTMLElement>): void => {
    ignoreRef.current = true
    onDelete(event)
  }, [onDelete])

  return (
    <Collapse
      className="collapse-panel"
      activeKey={activeKey}
      onChange={handleChange}
      expandIcon={expandIcon}
    >
      <Collapse.Panel
        header={<PanelHeader title={title} />}
        extra={<PanelExtra onDelete={handleDelete} />}
        key={title}
      >
        {children}
      </Collapse.Panel>
    </Collapse>
  )
}

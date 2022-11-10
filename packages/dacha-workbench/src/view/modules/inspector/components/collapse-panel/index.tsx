import React, {
  useCallback,
  useState,
  useRef,
  FC,
} from 'react'
import { Collapse } from 'antd'

import { PanelExtra } from './panel-extra'

import './style.less'

export interface CollapsePanelProps {
  children: JSX.Element | Array<JSX.Element | null> | string | null
  title: string
  onDelete: (event: React.MouseEvent<HTMLElement>) => void
}

export const CollapsePanel: FC<CollapsePanelProps> = ({
  children,
  title,
  onDelete,
}) => {
  const ignoreRef = useRef(false)
  const [activeKey, setActiveKey] = useState<string | Array<string>>()

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
    >
      <Collapse.Panel
        header={title}
        extra={<PanelExtra onDelete={handleDelete} />}
        key={title}
      >
        {children}
      </Collapse.Panel>
    </Collapse>
  )
}

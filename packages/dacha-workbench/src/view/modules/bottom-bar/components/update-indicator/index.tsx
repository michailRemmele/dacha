import {
  useState,
  useEffect,
  FC,
} from 'react'
import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'

import { SpinCSS } from './update-indicator.style'

export const UpdateIndicator: FC = () => {
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const handleBuildStart = (): void => setIsLoading(true)
    const handleBuildEnd = (): void => setIsLoading(false)

    const unsubscribeBuildStart = window.electron.onExtensionBuildStart(handleBuildStart)
    const unsubscribeBuildEnd = window.electron.onExtensionBuildEnd(handleBuildEnd)

    return () => {
      unsubscribeBuildStart()
      unsubscribeBuildEnd()
    }
  }, [])

  if (!isLoading) {
    return null
  }

  return (
    <Spin css={SpinCSS} indicator={<LoadingOutlined spin />} size="small" />
  )
}

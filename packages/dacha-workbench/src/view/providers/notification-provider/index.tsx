import { createContext, ReactElement } from 'react'
import { notification } from 'antd'
import type { FC } from 'react'

type NotificationInstance = ReturnType<typeof notification.useNotification>[0]

interface NotificationProviderProps {
  children: ReactElement | ReactElement[]
}

export const NotificationContext = createContext({} as NotificationInstance)

export const NotificationProvider: FC<NotificationProviderProps> = ({ children }) => {
  const [api, contextHolder] = notification.useNotification()

  return (
    <NotificationContext.Provider value={api}>
      {children}
      {contextHolder}
    </NotificationContext.Provider>
  )
}

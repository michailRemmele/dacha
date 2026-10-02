import { createContext, useMemo, ReactElement } from 'react';
import type { FC } from 'react';

export interface WidgetFieldContextType {
  path: string[];
  fieldPath: string[];
  data: Record<string, unknown>;
}

export const WidgetFieldContext = createContext<WidgetFieldContextType>({
  path: [],
  fieldPath: [],
  data: {},
});

interface WidgetFieldProviderProps {
  path: string[];
  fieldPath: string[];
  data?: Record<string, unknown>;
  children: ReactElement;
}

export const WidgetFieldProvider: FC<WidgetFieldProviderProps> = ({
  path,
  fieldPath,
  data,
  children,
}) => {
  const context = useMemo(
    () => ({
      path,
      fieldPath,
      data: { ...data },
    }),
    [path, fieldPath, data],
  );

  return (
    <WidgetFieldContext.Provider value={context}>
      {children}
    </WidgetFieldContext.Provider>
  );
};

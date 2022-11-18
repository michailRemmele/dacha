import React, {
  useContext,
  useMemo,
  FC,
} from 'react'

import { EngineContext } from '../engine-provider'
import type { WidgetSchema } from '../../../types/widget-schema'
import { componentsSchema, systemsSchema } from '../../engine-widgets-schema'

const NAMESPACE_ROOT = 'widgetsSchema'
const NAMESPACE_CUSTOM = 'customWidgetsSchema'

export interface SchemasDataEntry {
  name: string
  schema: WidgetSchema
  namespace: string
}

interface SchemasData {
  components: Array<SchemasDataEntry>
  systems: Array<SchemasDataEntry>
}

interface SchemasProviderProps {
  children: JSX.Element | Array<JSX.Element>
}

export const SchemasContext = React.createContext<SchemasData>({
  components: [],
  systems: [],
})

export const SchemasProvider: FC<SchemasProviderProps> = ({
  children,
}): JSX.Element => {
  const { sceneContext } = useContext(EngineContext)

  const extComponentsSchema = sceneContext?.data.extComponentsSchema as Record<string, WidgetSchema>
  const extSystemsSchema = sceneContext?.data.extSystemsSchema as Record<string, WidgetSchema>

  const components = useMemo(() => ([] as Array<SchemasDataEntry>).concat(
    Object.keys(componentsSchema).map((key) => ({
      name: key,
      schema: componentsSchema[key],
      namespace: NAMESPACE_ROOT,
    })),
    Object.keys(extComponentsSchema).map((key) => ({
      name: key,
      schema: extComponentsSchema[key],
      namespace: NAMESPACE_CUSTOM,
    })),
  ), [extComponentsSchema])

  const systems = useMemo(() => ([] as Array<SchemasDataEntry>).concat(
    Object.keys(systemsSchema).map((key) => ({
      name: key,
      schema: systemsSchema[key],
      namespace: NAMESPACE_ROOT,
    })),
    Object.keys(extSystemsSchema).map((key) => ({
      name: key,
      schema: extSystemsSchema[key],
      namespace: NAMESPACE_CUSTOM,
    })),
  ), [extSystemsSchema])

  const context = useMemo(() => ({
    components,
    systems,
  }), [components])

  return (
    <SchemasContext.Provider value={context}>
      {children}
    </SchemasContext.Provider>
  )
}

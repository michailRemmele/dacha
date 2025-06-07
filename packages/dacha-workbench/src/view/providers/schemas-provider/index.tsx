import React, { useMemo, FC } from 'react'
import i18next from 'i18next'

import type { WidgetSchema } from '../../../types/widget-schema'
import { componentsSchema, systemsSchema } from '../../modules/inspector/widgets'
import {
  useExtension,
  useSystems,
  useComponents,
} from '../../hooks'
import { schemaRegistry } from '../../modules/inspector/schema-registry'

import { NAMESPACE_EDITOR, NAMESPACE_EXTENSION } from './consts'

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
  const extension = useExtension()

  const extComponentsSchema = useComponents()
  const extSystemsSchema = useSystems()

  const components = useMemo(() => ([] as Array<SchemasDataEntry>).concat(
    Object.keys(componentsSchema).map((key) => ({
      name: key,
      schema: componentsSchema[key],
      namespace: NAMESPACE_EDITOR,
    })),
    extComponentsSchema ? Object.keys(extComponentsSchema).map((key) => ({
      name: key,
      schema: extComponentsSchema[key],
      namespace: NAMESPACE_EXTENSION,
    })) : [],
  ), [extComponentsSchema])

  const systems = useMemo(() => ([] as Array<SchemasDataEntry>).concat(
    Object.keys(systemsSchema).map((key) => ({
      name: key,
      schema: systemsSchema[key],
      namespace: NAMESPACE_EDITOR,
    })),
    extSystemsSchema ? Object.keys(extSystemsSchema).map((key) => ({
      name: key,
      schema: extSystemsSchema[key],
      namespace: NAMESPACE_EXTENSION,
    })) : [],
  ), [extSystemsSchema])

  useMemo(() => {
    Object.keys(extension.locales).forEach((lng) => {
      i18next.addResourceBundle(lng, NAMESPACE_EXTENSION, extension.locales[lng])
    })
  }, [extension])

  const context = useMemo(() => ({
    components,
    systems,
  }), [components, systems])

  return (
    <SchemasContext.Provider value={context}>
      {children}
    </SchemasContext.Provider>
  )
}

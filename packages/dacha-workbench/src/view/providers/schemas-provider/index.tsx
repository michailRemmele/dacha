import React, {
  useState,
  useContext,
  useMemo,
  useEffect,
  FC,
} from 'react'
import i18next from 'i18next'

import { schemaRegistry } from '../../../decorators/schema-registry'
import type { WidgetSchema } from '../../../types/widget-schema'
import { componentsSchema, systemsSchema } from '../../modules/inspector/widgets'
import { useExtension } from '../../hooks'
import { EngineContext } from '../engine-provider'
import { EventType } from '../../../events'

import { NAMESPACE_EDITOR, NAMESPACE_EXTENSION } from './consts'

export interface SchemasDataEntry {
  name: string
  schema: WidgetSchema
  namespace: string
}

interface SchemasData {
  components: SchemasDataEntry[]
  systems: SchemasDataEntry[]
}

interface SchemasProviderProps {
  children: JSX.Element | JSX.Element[]
}

export const SchemasContext = React.createContext<SchemasData>({
  components: [],
  systems: [],
})

export const SchemasProvider: FC<SchemasProviderProps> = ({
  children,
}): JSX.Element => {
  const { world } = useContext(EngineContext)
  const extension = useExtension()

  const [extComponentsSchema, setExtComponentsSchema] = useState(() => schemaRegistry.getGroup('component'))
  const [extSystemsSchema, setExtSystemsSchema] = useState(() => schemaRegistry.getGroup('system'))

  const components = useMemo(() => ([] as SchemasDataEntry[]).concat(
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

  const systems = useMemo(() => ([] as SchemasDataEntry[]).concat(
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
      if (i18next.hasResourceBundle(lng, NAMESPACE_EXTENSION)) {
        i18next.removeResourceBundle(lng, NAMESPACE_EXTENSION)
      }
      i18next.addResourceBundle(lng, NAMESPACE_EXTENSION, extension.locales[lng])
    })
  }, [extension])

  useEffect(() => {
    const handleExtensionUpdated = (): void => {
      setExtComponentsSchema(schemaRegistry.getGroup('component'))
      setExtSystemsSchema(schemaRegistry.getGroup('system'))
    }

    world.addEventListener(EventType.ExtensionUpdated, handleExtensionUpdated)

    return (): void => {
      world.removeEventListener(EventType.ExtensionUpdated, handleExtensionUpdated)
    }
  }, [world])

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

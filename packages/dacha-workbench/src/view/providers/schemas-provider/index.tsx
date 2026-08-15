import React, { useState, useContext, useMemo, useEffect, FC } from 'react';
import i18next from 'i18next';

import { schemaRegistry } from '../../../decorators/schema-registry';
import {
  componentsSchema,
  systemsSchema,
  assetsSchema,
} from '../../modules/inspector/widgets';
import { useExtension } from '../../hooks';
import { EngineContext } from '../engine-provider';
import { EventType } from '../../../events';

import { buildSchema, type SchemasDataEntry } from './build-schema';
import { NAMESPACE_EXTENSION } from './consts';

export type { SchemasDataEntry };

interface SchemasData {
  components: SchemasDataEntry[];
  systems: SchemasDataEntry[];
  assets: SchemasDataEntry[];
}

interface SchemasProviderProps {
  children: JSX.Element | JSX.Element[];
}

export const SchemasContext = React.createContext<SchemasData>({
  components: [],
  systems: [],
  assets: [],
});

export const SchemasProvider: FC<SchemasProviderProps> = ({
  children,
}): JSX.Element => {
  const world = useContext(EngineContext)?.world;
  const extension = useExtension();

  const [extComponentsSchema, setExtComponentsSchema] = useState(() =>
    schemaRegistry.getGroup('component'),
  );
  const [extSystemsSchema, setExtSystemsSchema] = useState(() =>
    schemaRegistry.getGroup('system'),
  );
  const [extAssetsSchema, setExtAssetsSchema] = useState(() =>
    schemaRegistry.getGroup('asset'),
  );

  const components = useMemo(
    () => buildSchema(componentsSchema, extComponentsSchema),
    [extComponentsSchema],
  );

  const systems = useMemo(
    () => buildSchema(systemsSchema, extSystemsSchema),
    [extSystemsSchema],
  );

  const assets = useMemo(
    () => buildSchema(assetsSchema, extAssetsSchema),
    [extAssetsSchema],
  );

  useMemo(() => {
    if (!extension) {
      return;
    }

    Object.keys(extension.locales).forEach((lng) => {
      if (i18next.hasResourceBundle(lng, NAMESPACE_EXTENSION)) {
        i18next.removeResourceBundle(lng, NAMESPACE_EXTENSION);
      }
      i18next.addResourceBundle(
        lng,
        NAMESPACE_EXTENSION,
        extension.locales[lng],
      );
    });
  }, [extension]);

  useEffect(() => {
    if (!world) {
      return;
    }

    const handleExtensionUpdated = (): void => {
      setExtComponentsSchema(schemaRegistry.getGroup('component'));
      setExtSystemsSchema(schemaRegistry.getGroup('system'));
      setExtAssetsSchema(schemaRegistry.getGroup('asset'));
    };

    world.addEventListener(EventType.ExtensionUpdated, handleExtensionUpdated);

    return (): void => {
      world.removeEventListener(
        EventType.ExtensionUpdated,
        handleExtensionUpdated,
      );
    };
  }, [world]);

  const context = useMemo(
    () => ({
      components,
      systems,
      assets,
    }),
    [components, systems, assets],
  );

  return (
    <SchemasContext.Provider value={context}>
      {children}
    </SchemasContext.Provider>
  );
};

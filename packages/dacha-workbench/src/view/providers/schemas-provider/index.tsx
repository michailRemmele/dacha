import React, {
  useState,
  useContext,
  useMemo,
  useEffect,
  FC,
  ReactElement,
} from 'react';
import i18next from 'i18next';

import { useExtension } from '../../hooks';
import { EngineContext } from '../engine-provider';
import { EventType } from '../../../events';
import type {
  CollectedSchemas,
  SchemaEntry,
} from '../../../schema/collect-schemas';

import { NAMESPACE_EXTENSION } from './consts';

export type SchemasDataEntry = SchemaEntry;

interface SchemasData extends CollectedSchemas {
  isReady: boolean;
}

interface SchemasProviderProps {
  children: ReactElement | ReactElement[];
}

const INITIAL: CollectedSchemas = {
  components: [],
  systems: [],
  assets: [],
  behaviors: [],
  shaders: [],
  filterEffects: [],
};

export const SchemasContext = React.createContext<SchemasData>({
  ...INITIAL,
  isReady: false,
});

export const SchemasProvider: FC<SchemasProviderProps> = ({
  children,
}): ReactElement => {
  const world = useContext(EngineContext)?.world;
  const extension = useExtension();

  const [schemas, setSchemas] = useState<CollectedSchemas>(
    () => (world?.data.schemas as CollectedSchemas | undefined) ?? INITIAL,
  );

  const [isReady, setIsReady] = useState(false);

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
      setSchemas(
        (world.data.schemas as CollectedSchemas | undefined) ?? INITIAL,
      );
    };

    handleExtensionUpdated();
    setIsReady(true);

    world.addEventListener(EventType.ExtensionUpdated, handleExtensionUpdated);

    return (): void => {
      world.removeEventListener(
        EventType.ExtensionUpdated,
        handleExtensionUpdated,
      );
    };
  }, [world]);

  const context = useMemo(
    () => ({ ...schemas, isReady }),
    [schemas, isReady],
  );

  return (
    <SchemasContext.Provider value={context}>
      {children}
    </SchemasContext.Provider>
  );
};

import React, { useState, useMemo, useEffect, useContext, FC } from 'react';
import type { UIOptions, LoadUIFn } from 'dacha';
import {
  Engine,
  MouseInputSystem,
  MouseControlSystem,
  CameraSystem,
  UIBridge,
  Renderer,
  Transform,
  Camera,
  MouseControl,
  Shape,
  Sprite,
  PixiView,
} from 'dacha';
import {
  type Sorting,
  type SortingOrder,
  type SortingLayer,
} from 'dacha/renderer';

import { CommandContext } from '../command-provider';
import { getEditorConfig } from '../../../engine/config';
import {
  ProjectLoader,
  SceneViewer,
  ToolManager,
  ZoomToolSystem,
  HandToolSystem,
  PointerToolSystem,
  TemplateToolSystem,
  GridSystem,
  SettingsSystem,
  Tool,
  ToolController,
  Settings,
  Frame,
} from '../../../engine';

interface EngineProviderProps {
  children: JSX.Element | JSX.Element[];
}

export const EngineContext = React.createContext<UIOptions>({} as UIOptions);

export const EngineProvider: FC<EngineProviderProps> = ({
  children,
}): JSX.Element => {
  const { store } = useContext(CommandContext);

  const [context, setContext] = useState<UIOptions>();

  const sorting = useMemo<Sorting>(() => {
    const projectConfig = window.electron.getProjectConfig();
    const projectSorting = projectConfig.globalOptions.find(
      (option) => option.name === 'sorting',
    );
    return {
      order: (projectSorting?.options?.order ?? 'bottomRight') as SortingOrder,
      layers: (projectSorting?.options?.layers ?? []) as SortingLayer[],
    };
  }, []);

  const editorEngine = useMemo(
    () =>
      new Engine({
        config: getEditorConfig({ sorting, store }),
        systems: [
          MouseInputSystem,
          MouseControlSystem,
          CameraSystem,
          UIBridge,
          Renderer,
          ProjectLoader,
          SceneViewer,
          ToolManager,
          ZoomToolSystem,
          HandToolSystem,
          PointerToolSystem,
          TemplateToolSystem,
          GridSystem,
          SettingsSystem,
        ],
        components: [
          Transform,
          Camera,
          MouseControl,
          Tool,
          ToolController,
          Shape,
          Sprite,
          PixiView,
          Settings,
          Frame,
        ],
        resources: {
          [ProjectLoader.systemName]: {
            store,
          },
          [UIBridge.systemName]: {
            loadUI: (): ReturnType<LoadUIFn> =>
              Promise.resolve({
                onInit: (options: UIOptions): void => setContext(options),
                onDestroy: (): void => setContext(void 0),
              }),
          },
        },
      }),
    [sorting],
  );

  useEffect(() => {
    void editorEngine.play();
  }, [editorEngine]);

  return (
    <EngineContext.Provider value={context as UIOptions}>
      {children}
    </EngineContext.Provider>
  );
};

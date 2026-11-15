import React, { useState, useMemo, useEffect, useContext, FC, ReactElement } from 'react';
import type { UIContext, LoadUIFn } from 'dacha';
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
  BitmapText,
  PixiView,
  Mesh,
  Texture,
  Audio,
  BitmapFont,
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
  DebugVisualizer,
  Tool,
  ToolController,
  Settings,
  Frame,
  Technical,
} from '../../../engine';

interface EngineProviderProps {
  children: ReactElement | ReactElement[];
}

export const EngineContext = React.createContext<UIContext>({} as UIContext);

export const EngineProvider: FC<EngineProviderProps> = ({
  children,
}): ReactElement => {
  const { store } = useContext(CommandContext);

  const [context, setContext] = useState<UIContext>();

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
          UIBridge.with({
            loadUI: (): ReturnType<LoadUIFn> =>
              Promise.resolve({
                onInit: (uiContext: UIContext): void => setContext(uiContext),
                onDestroy: (): void => setContext(void 0),
              }),
          }),
          Renderer,
          ProjectLoader.with({ store }),
          SceneViewer,
          ToolManager,
          ZoomToolSystem,
          HandToolSystem,
          PointerToolSystem,
          TemplateToolSystem,
          GridSystem,
          SettingsSystem,
          DebugVisualizer,
        ],
        components: [
          Transform,
          Camera,
          MouseControl,
          Tool,
          ToolController,
          Shape,
          Sprite,
          BitmapText,
          Mesh,
          PixiView,
          Settings,
          Frame,
          Technical,
        ],
        assets: [Texture, Audio, BitmapFont],
      }),
    [sorting],
  );

  useEffect(() => {
    void editorEngine.play();
  }, [editorEngine]);

  return (
    <EngineContext.Provider value={context as UIContext}>
      {children}
    </EngineContext.Provider>
  );
};

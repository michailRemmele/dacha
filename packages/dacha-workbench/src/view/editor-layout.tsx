import { Splitter } from 'antd';

import { persistentStorage } from '../persistent-storage';
import { CANVAS_ROOT } from '../consts/root-nodes';

import { useEditorReady } from './hooks';
import { Window } from './components';
import { Explorer } from './modules/explorer';
import { Inspector } from './modules/inspector';
import { Toolbar } from './modules/toolbar';
import { EditorLayoutStyled, CanvasStyled, ToolbarStyled } from './app.style';

const MIN_EXPLORER_WIDTH = 250;
const MIN_INSPECTOR_WIDTH = 300;
const MIN_CANVAS_WIDTH = '40%';

const EXPLORER_KEY = 'layout.explorer.size';
const INSPECTOR_KEY = 'layout.inspector.size';
const DEFAULT_SIZE = '25%';

export interface PanelSizes {
  explorer: number | string;
  inspector: number | string;
}

export const loadPanelSizes = (): PanelSizes => ({
  explorer:
    persistentStorage.get<number | string>(EXPLORER_KEY) ?? DEFAULT_SIZE,
  inspector:
    persistentStorage.get<number | string>(INSPECTOR_KEY) ?? DEFAULT_SIZE,
});

export const savePanelSizes = (sizes: number[]): void => {
  persistentStorage.set(EXPLORER_KEY, sizes[0]);
  persistentStorage.set(INSPECTOR_KEY, sizes[2]);
};

export const EditorLayout = (): JSX.Element => {
  const isEditorReady = useEditorReady();

  const sizes = loadPanelSizes();

  return (
    <EditorLayoutStyled>
      <Splitter onResizeEnd={savePanelSizes}>
        <Splitter.Panel defaultSize={sizes.explorer} min={MIN_EXPLORER_WIDTH}>
          <Window>{isEditorReady && <Explorer />}</Window>
        </Splitter.Panel>
        <Splitter.Panel min={MIN_CANVAS_WIDTH}>
          <Window>
            <CanvasStyled>
              <ToolbarStyled>{isEditorReady && <Toolbar />}</ToolbarStyled>
              <div id={CANVAS_ROOT} />
            </CanvasStyled>
          </Window>
        </Splitter.Panel>
        <Splitter.Panel defaultSize={sizes.inspector} min={MIN_INSPECTOR_WIDTH}>
          <Window>{isEditorReady && <Inspector />}</Window>
        </Splitter.Panel>
      </Splitter>
    </EditorLayoutStyled>
  );
};

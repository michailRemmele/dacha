import type { ReactElement, RefObject } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Splitter } from 'antd';

import { persistentStorage } from '../persistent-storage';
import { CANVAS_ROOT } from '../consts/root-nodes';

import { useEditorReady } from './hooks';
import { Window } from './components';
import { Explorer } from './modules/explorer';
import { Inspector } from './modules/inspector';
import { Toolbar } from './modules/toolbar';
import * as styles from './app.module.css';

const MIN_EXPLORER_WIDTH = 200;
const MIN_INSPECTOR_WIDTH = 225;
const MIN_CANVAS_WIDTH = 400;

const DIVIDERS_WIDTH = 2 * 2;

const DEFAULT_EXPLORER_WIDTH = 300;
const DEFAULT_INSPECTOR_WIDTH = 340;

const EXPLORER_KEY = 'layout.explorer.size';
const INSPECTOR_KEY = 'layout.inspector.size';

export interface PanelSizes {
  explorer: number;
  inspector: number;
}

export const loadPanelSizes = (): PanelSizes => ({
  explorer:
    persistentStorage.get<number>(EXPLORER_KEY) ?? DEFAULT_EXPLORER_WIDTH,
  inspector:
    persistentStorage.get<number>(INSPECTOR_KEY) ?? DEFAULT_INSPECTOR_WIDTH,
});

export const savePanelSizes = (sizes: PanelSizes): void => {
  persistentStorage.set(EXPLORER_KEY, sizes.explorer);
  persistentStorage.set(INSPECTOR_KEY, sizes.inspector);
};

const clampPanelSizes = (
  target: PanelSizes,
  containerWidth: number,
): PanelSizes => {
  const available = containerWidth - DIVIDERS_WIDTH - MIN_CANVAS_WIDTH;
  const total = target.explorer + target.inspector;
  const minTotal = MIN_EXPLORER_WIDTH + MIN_INSPECTOR_WIDTH;

  if (total <= available) {
    return target;
  }
  if (available <= minTotal) {
    return { explorer: MIN_EXPLORER_WIDTH, inspector: MIN_INSPECTOR_WIDTH };
  }

  const scale = (available - minTotal) / (total - minTotal);

  return {
    explorer: Math.round(
      MIN_EXPLORER_WIDTH + (target.explorer - MIN_EXPLORER_WIDTH) * scale,
    ),
    inspector: Math.round(
      MIN_INSPECTOR_WIDTH + (target.inspector - MIN_INSPECTOR_WIDTH) * scale,
    ),
  };
};

const isSamePanelSizes = (a: PanelSizes, b: PanelSizes): boolean =>
  a.explorer === b.explorer && a.inspector === b.inspector;

const useClampedPanelSizes = (
  containerRef: RefObject<HTMLDivElement | null>,
): {
  sizes: PanelSizes;
  onResize: (pxSizes: number[]) => void;
  onResizeEnd: (pxSizes: number[]) => void;
} => {
  const [target, setTarget] = useState(loadPanelSizes);
  const [sizes, setSizes] = useState(target);

  const targetRef = useRef(target);
  const containerWidthRef = useRef(0);
  targetRef.current = target;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return undefined;
    }

    const observer = new ResizeObserver(([entry]) => {
      containerWidthRef.current = entry.contentRect.width;
      const next = clampPanelSizes(targetRef.current, entry.contentRect.width);
      setSizes((prev) => (isSamePanelSizes(prev, next) ? prev : next));
    });
    observer.observe(container);

    return (): void => observer.disconnect();
  }, [containerRef]);

  const onResize = (pxSizes: number[]): void => {
    const next = clampPanelSizes(
      { explorer: pxSizes[0], inspector: pxSizes[2] },
      containerWidthRef.current,
    );
    setSizes((prev) => (isSamePanelSizes(prev, next) ? prev : next));
  };

  const onResizeEnd = (pxSizes: number[]): void => {
    const next = clampPanelSizes(
      { explorer: pxSizes[0], inspector: pxSizes[2] },
      containerWidthRef.current,
    );
    setSizes((prev) => (isSamePanelSizes(prev, next) ? prev : next));
    setTarget((prev) => (isSamePanelSizes(prev, next) ? prev : next));
    savePanelSizes(next);
  };

  return { sizes, onResize, onResizeEnd };
};

export const EditorLayout = (): ReactElement => {
  const isEditorReady = useEditorReady();
  const containerRef = useRef<HTMLDivElement>(null);
  const { sizes, onResize, onResizeEnd } = useClampedPanelSizes(containerRef);

  return (
    <div ref={containerRef} className={styles.editorLayout}>
      <Splitter
        classNames={{ dragger: styles.editorDragger }}
        onResize={onResize}
        onResizeEnd={onResizeEnd}
      >
        <Splitter.Panel size={sizes.explorer} min={MIN_EXPLORER_WIDTH}>
          <Window>{isEditorReady && <Explorer />}</Window>
        </Splitter.Panel>
        <Splitter.Panel min={MIN_CANVAS_WIDTH}>
          <Window>
            <div className={styles.canvas}>
              <div className={styles.toolbar}>
                {isEditorReady && <Toolbar />}
              </div>
              <div id={CANVAS_ROOT} className={styles.canvasRoot} />
            </div>
          </Window>
        </Splitter.Panel>
        <Splitter.Panel size={sizes.inspector} min={MIN_INSPECTOR_WIDTH}>
          <Window>{isEditorReady && <Inspector />}</Window>
        </Splitter.Panel>
      </Splitter>
    </div>
  );
};

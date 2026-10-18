import { useState, useEffect, type RefObject } from 'react';
import { Application, BitmapText, type BitmapFont } from 'pixi.js';

import { MAX_CANVAS_HEIGHT, MAX_PREVIEW_FONT_SIZE } from './consts';

export const usePixiText = (
  host: RefObject<HTMLDivElement | null>,
  font: BitmapFont | undefined,
  text: string,
  color: string,
): void => {
  const [app, setApp] = useState<Application>();
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const element = host.current;
    if (!element) {
      return undefined;
    }

    const application = new Application();
    let isDisposed = false;
    let isReady = false;

    void application
      .init({
        autoStart: false,
        backgroundAlpha: 0,
        antialias: false,
        width: Math.max(element.clientWidth, 1),
        height: 1,
        resolution: window.devicePixelRatio,
        autoDensity: true,
      })
      .then(() => {
        if (isDisposed) {
          application.destroy(true, { children: true });
          return;
        }
        isReady = true;
        element.appendChild(application.canvas);
        setApp(application);
      });

    const resizeObserver = new ResizeObserver(() =>
      setWidth(element.clientWidth),
    );
    resizeObserver.observe(element);
    setWidth(element.clientWidth);

    return (): void => {
      isDisposed = true;
      resizeObserver.disconnect();
      if (isReady) {
        application.destroy(true, { children: true });
      }
    };
  }, [host]);

  useEffect(() => {
    if (!app) {
      return;
    }

    app.stage.removeChildren().forEach((child) => child.destroy());

    const canvasWidth = Math.max(width, 1);
    let canvasHeight = 1;

    if (font) {
      const fontSize = Math.min(
        font.fontMetrics.fontSize,
        MAX_PREVIEW_FONT_SIZE,
      );
      const view = new BitmapText({
        text,
        style: {
          fontFamily: font.fontFamily,
          fontSize,
          fill: color,
          wordWrap: true,
          wordWrapWidth: canvasWidth,
          whiteSpace: 'pre-line',
        },
      });
      app.stage.addChild(view);
      const baseLineOffset =
        font.baseLineOffset * (fontSize / font.baseMeasurementFontSize);
      canvasHeight = Math.min(
        Math.max(Math.ceil(view.height + baseLineOffset), 1),
        MAX_CANVAS_HEIGHT,
      );
    }

    app.renderer.resize(canvasWidth, canvasHeight);
    app.render();
  }, [app, font, text, color, width]);
};

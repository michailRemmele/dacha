import { GraphicsContext } from 'pixi.js';

import {
  Shape,
  type Rectangle,
  type RoundRectangle,
  type Circle,
  type Ellipse,
} from '../../../../components/shape';

export const getGraphicsContext = (shape: Shape): GraphicsContext => {
  switch (shape.type) {
    case 'rectangle': {
      const {
        width,
        height,
        strokeWidth,
        strokeColor,
        strokeAlignment,
        fill,
        pixelLine,
      } = shape as Rectangle;
      const rectangle = new GraphicsContext()
        .rect(-width / 2, -height / 2, width, height)
        .stroke({
          width: strokeWidth,
          alignment: strokeAlignment,
          color: strokeColor,
          pixelLine,
        });
      if (fill) {
        rectangle.fill(fill);
      }
      return rectangle;
    }
    case 'roundRectangle': {
      const {
        width,
        height,
        radius,
        strokeWidth,
        strokeColor,
        strokeAlignment,
        fill,
        pixelLine,
      } = shape as RoundRectangle;
      const rectangle = new GraphicsContext()
        .roundRect(-width / 2, -height / 2, width, height, radius)
        .stroke({
          width: strokeWidth,
          alignment: strokeAlignment,
          color: strokeColor,
          pixelLine,
        });
      if (fill) {
        rectangle.fill(fill);
      }
      return rectangle;
    }
    case 'circle': {
      const {
        radius,
        strokeWidth,
        strokeColor,
        strokeAlignment,
        fill,
        pixelLine,
      } = shape as Circle;
      const circle = new GraphicsContext()
        .circle(0, 0, radius)
        .stroke({
          width: strokeWidth,
          alignment: strokeAlignment,
          color: strokeColor,
          pixelLine,
        });
      if (fill) {
        circle.fill(fill);
      }
      return circle;
    }
    case 'ellipse': {
      const {
        radiusX,
        radiusY,
        strokeWidth,
        strokeColor,
        strokeAlignment,
        fill,
        pixelLine,
      } = shape as Ellipse;
      const ellipse = new GraphicsContext()
        .ellipse(0, 0, radiusX, radiusY)
        .stroke({
          width: strokeWidth,
          alignment: strokeAlignment,
          color: strokeColor,
          pixelLine,
        });
      if (fill) {
        ellipse.fill(fill);
      }
      return ellipse;
    }
  }
};

export const getGraphicsContextKey = (shape: Shape): string => {
  switch (shape.type) {
    case 'rectangle': {
      const {
        type,
        width,
        height,
        strokeWidth,
        strokeColor,
        strokeAlignment,
        fill,
        pixelLine,
      } = shape as Rectangle;
      return `${type}_${width}_${height}_${strokeWidth}_${strokeColor}_${strokeAlignment}_${fill}_${pixelLine}`;
    }
    case 'roundRectangle': {
      const {
        type,
        width,
        height,
        radius,
        strokeWidth,
        strokeColor,
        strokeAlignment,
        fill,
        pixelLine,
      } = shape as RoundRectangle;
      return `${type}_${width}_${height}_${radius}_${strokeWidth}_${strokeColor}_${strokeAlignment}_${fill}_${pixelLine}`;
    }
    case 'circle': {
      const {
        type,
        radius,
        strokeWidth,
        strokeColor,
        strokeAlignment,
        fill,
        pixelLine,
      } = shape as Circle;
      return `${type}_${radius}_${strokeWidth}_${strokeColor}_${strokeAlignment}_${fill}_${pixelLine}`;
    }
    case 'ellipse': {
      const {
        type,
        radiusX,
        radiusY,
        strokeWidth,
        strokeColor,
        strokeAlignment,
        fill,
        pixelLine,
      } = shape as Ellipse;
      return `${type}_${radiusX}_${radiusY}_${strokeWidth}_${strokeColor}_${strokeAlignment}_${fill}_${pixelLine}`;
    }
  }
};

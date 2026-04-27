import { GraphicsContext } from 'pixi.js';

import { Shape } from '../../../../components/shape';

export const getGraphicsContext = (shape: Shape): GraphicsContext => {
  switch (shape.geometry.type) {
    case 'rectangle': {
      const { size } = shape.geometry;
      const {
        strokeWidth,
        strokeColor,
        strokeAlignment,
        fill,
        pixelLine,
      } = shape;
      const rectangle = new GraphicsContext()
        .rect(-size.x / 2, -size.y / 2, size.x, size.y)
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
      const { size, radius } = shape.geometry;
      const {
        strokeWidth,
        strokeColor,
        strokeAlignment,
        fill,
        pixelLine,
      } = shape;
      const rectangle = new GraphicsContext()
        .roundRect(-size.x / 2, -size.y / 2, size.x, size.y, radius)
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
      const { radius } = shape.geometry;
      const {
        strokeWidth,
        strokeColor,
        strokeAlignment,
        fill,
        pixelLine,
      } = shape;
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
      const { radius } = shape.geometry;
      const {
        strokeWidth,
        strokeColor,
        strokeAlignment,
        fill,
        pixelLine,
      } = shape;
      const ellipse = new GraphicsContext()
        .ellipse(0, 0, radius.x, radius.y)
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
    case 'line': {
      const { point1, point2 } = shape.geometry;
      const {
        strokeWidth,
        strokeColor,
        strokeAlignment,
        pixelLine,
      } = shape;
      return new GraphicsContext()
        .moveTo(point1.x, point1.y)
        .lineTo(point2.x, point2.y)
        .stroke({
          width: strokeWidth,
          alignment: strokeAlignment,
          color: strokeColor,
          pixelLine,
        });
    }
  }
};

export const getGraphicsContextKey = (shape: Shape): string => {
  switch (shape.geometry.type) {
    case 'rectangle': {
      const { type, size } = shape.geometry;
      const {
        strokeWidth,
        strokeColor,
        strokeAlignment,
        fill,
        pixelLine,
      } = shape;
      return `${type}_${size.x}_${size.y}_${strokeWidth}_${strokeColor}_${strokeAlignment}_${fill}_${pixelLine}`;
    }
    case 'roundRectangle': {
      const { type, size, radius } = shape.geometry;
      const {
        strokeWidth,
        strokeColor,
        strokeAlignment,
        fill,
        pixelLine,
      } = shape;
      return `${type}_${size.x}_${size.y}_${radius}_${strokeWidth}_${strokeColor}_${strokeAlignment}_${fill}_${pixelLine}`;
    }
    case 'circle': {
      const { type, radius } = shape.geometry;
      const {
        strokeWidth,
        strokeColor,
        strokeAlignment,
        fill,
        pixelLine,
      } = shape;
      return `${type}_${radius}_${strokeWidth}_${strokeColor}_${strokeAlignment}_${fill}_${pixelLine}`;
    }
    case 'ellipse': {
      const { type, radius } = shape.geometry;
      const {
        strokeWidth,
        strokeColor,
        strokeAlignment,
        fill,
        pixelLine,
      } = shape;
      return `${type}_${radius.x}_${radius.y}_${strokeWidth}_${strokeColor}_${strokeAlignment}_${fill}_${pixelLine}`;
    }
    case 'line': {
      const { type, point1, point2 } = shape.geometry;
      const {
        strokeWidth,
        strokeColor,
        strokeAlignment,
        pixelLine,
      } = shape;
      return `${type}_${point1.x}_${point1.y}_${point2.x}_${point2.y}_${strokeWidth}_${strokeColor}_${strokeAlignment}_${pixelLine}`;
    }
  }
};

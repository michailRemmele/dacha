import { GraphicsContext } from 'pixi.js';

import { Shape } from '../../../../components/shape';

const applyStroke = (
  context: GraphicsContext,
  { strokeWidth, strokeAlignment, strokeColor, pixelLine }: Shape,
): void => {
  if (strokeWidth <= 0 && !pixelLine) {
    return;
  }

  context.stroke({
    width: strokeWidth,
    alignment: strokeAlignment,
    color: strokeColor,
    pixelLine,
  });
};

const applyFill = (context: GraphicsContext, { fill }: Shape): void => {
  if (!fill) {
    return;
  }

  context.fill(fill);
};

export const getGraphicsContext = (shape: Shape): GraphicsContext => {
  switch (shape.geometry.type) {
    case 'rectangle': {
      const { size } = shape.geometry;
      const rectangle = new GraphicsContext().rect(
        -size.x / 2,
        -size.y / 2,
        size.x,
        size.y,
      );
      applyStroke(rectangle, shape);
      applyFill(rectangle, shape);
      return rectangle;
    }
    case 'roundRectangle': {
      const { size, radius } = shape.geometry;
      const rectangle = new GraphicsContext().roundRect(
        -size.x / 2,
        -size.y / 2,
        size.x,
        size.y,
        radius,
      );
      applyStroke(rectangle, shape);
      applyFill(rectangle, shape);
      return rectangle;
    }
    case 'circle': {
      const { radius } = shape.geometry;
      const circle = new GraphicsContext().circle(0, 0, radius);
      applyStroke(circle, shape);
      applyFill(circle, shape);
      return circle;
    }
    case 'ellipse': {
      const { radius } = shape.geometry;
      const ellipse = new GraphicsContext().ellipse(0, 0, radius.x, radius.y);
      applyStroke(ellipse, shape);
      applyFill(ellipse, shape);
      return ellipse;
    }
    case 'line': {
      const { point1, point2 } = shape.geometry;
      const line = new GraphicsContext()
        .moveTo(point1.x, point1.y)
        .lineTo(point2.x, point2.y);
      applyStroke(line, shape);
      return line;
    }
  }
};

export const getGraphicsContextKey = (shape: Shape): string => {
  switch (shape.geometry.type) {
    case 'rectangle': {
      const { type, size } = shape.geometry;
      const { strokeWidth, strokeColor, strokeAlignment, fill, pixelLine } =
        shape;
      return `${type}_${size.x}_${size.y}_${strokeWidth}_${strokeColor}_${strokeAlignment}_${fill}_${pixelLine}`;
    }
    case 'roundRectangle': {
      const { type, size, radius } = shape.geometry;
      const { strokeWidth, strokeColor, strokeAlignment, fill, pixelLine } =
        shape;
      return `${type}_${size.x}_${size.y}_${radius}_${strokeWidth}_${strokeColor}_${strokeAlignment}_${fill}_${pixelLine}`;
    }
    case 'circle': {
      const { type, radius } = shape.geometry;
      const { strokeWidth, strokeColor, strokeAlignment, fill, pixelLine } =
        shape;
      return `${type}_${radius}_${strokeWidth}_${strokeColor}_${strokeAlignment}_${fill}_${pixelLine}`;
    }
    case 'ellipse': {
      const { type, radius } = shape.geometry;
      const { strokeWidth, strokeColor, strokeAlignment, fill, pixelLine } =
        shape;
      return `${type}_${radius.x}_${radius.y}_${strokeWidth}_${strokeColor}_${strokeAlignment}_${fill}_${pixelLine}`;
    }
    case 'line': {
      const { type, point1, point2 } = shape.geometry;
      const { strokeWidth, strokeColor, strokeAlignment, pixelLine } = shape;
      return `${type}_${point1.x}_${point1.y}_${point2.x}_${point2.y}_${strokeWidth}_${strokeColor}_${strokeAlignment}_${pixelLine}`;
    }
  }
};

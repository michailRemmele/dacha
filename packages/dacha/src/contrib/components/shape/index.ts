import type { Graphics } from 'pixi.js';

import { Component } from '../../../engine/component';
import type { Point } from '../../../engine/math-lib';
import { type BlendingMode } from '../../types/view';

interface RenderData {
  view: Graphics;
  graphicsContextKey?: string;
}

export type ShapeType =
  'rectangle' | 'roundRectangle' | 'circle' | 'ellipse' | 'line';

/**
 * Fields shared by every shape config.
 *
 * @category Rendering
 */
export interface BaseShapeConfig {
  strokeColor?: string;
  strokeWidth?: number;
  strokeAlignment?: number;
  pixelLine?: boolean;
  fill?: string;
  opacity?: number;
  blending?: BlendingMode;
  disabled?: boolean;
  sortingLayer?: string;
  sortOffset?: Point;
}

/**
 * Options for a `rectangle` shape.
 *
 * @category Rendering
 */
export interface RectangleShapeConfig extends BaseShapeConfig {
  type: 'rectangle';
  /** The width and the height. */
  size?: Point;
}

/**
 * Options for a `roundRectangle` shape: a rectangle with round corners.
 *
 * @category Rendering
 */
export interface RoundRectangleShapeConfig extends BaseShapeConfig {
  type: 'roundRectangle';
  /** The width and the height. */
  size?: Point;
  /** The radius of the corners. */
  radius?: number;
}

/**
 * Options for a `circle` shape.
 *
 * @category Rendering
 */
export interface CircleShapeConfig extends BaseShapeConfig {
  type: 'circle';
  /** The radius. */
  radius?: number;
}

/**
 * Options for an `ellipse` shape.
 *
 * @category Rendering
 */
export interface EllipseShapeConfig extends BaseShapeConfig {
  type: 'ellipse';
  /** The horizontal and the vertical radius. */
  radius?: Point;
}

/**
 * Options for a `line` shape.
 *
 * @category Rendering
 */
export interface LineShapeConfig extends BaseShapeConfig {
  type: 'line';
  /** The start of the line, relative to the actor. */
  point1?: Point;
  /** The end of the line, relative to the actor. */
  point2?: Point;
}

/**
 * Options for {@link Shape}. The `type` field decides which variant it is.
 *
 * @category Rendering
 */
export type ShapeConfig =
  | RectangleShapeConfig
  | RoundRectangleShapeConfig
  | CircleShapeConfig
  | EllipseShapeConfig
  | LineShapeConfig;

/**
 * The geometry of a `rectangle` shape.
 *
 * @category Rendering
 */
export interface RectangleShapeGeometry {
  type: 'rectangle';
  /** The width and the height. */
  size: Point;
}

/**
 * The geometry of a `roundRectangle` shape: a rectangle with round corners.
 *
 * @category Rendering
 */
export interface RoundRectangleShapeGeometry {
  type: 'roundRectangle';
  /** The width and the height. */
  size: Point;
  /** The radius of the corners. */
  radius: number;
}

/**
 * The geometry of a `circle` shape.
 *
 * @category Rendering
 */
export interface CircleShapeGeometry {
  type: 'circle';
  /** The radius. */
  radius: number;
}

/**
 * The geometry of an `ellipse` shape.
 *
 * @category Rendering
 */
export interface EllipseShapeGeometry {
  type: 'ellipse';
  /** The horizontal and the vertical radius. */
  radius: Point;
}

/**
 * The geometry of a `line` shape.
 *
 * @category Rendering
 */
export interface LineShapeGeometry {
  type: 'line';
  /** The start of the line, relative to the actor. */
  point1: Point;
  /** The end of the line, relative to the actor. */
  point2: Point;
}

/**
 * The geometry of a {@link Shape}. The `type` field decides which variant it is.
 *
 * @category Rendering
 */
export type ShapeGeometry =
  | RectangleShapeGeometry
  | RoundRectangleShapeGeometry
  | CircleShapeGeometry
  | EllipseShapeGeometry
  | LineShapeGeometry;

/**
 * Draws a rectangle, a rectangle with round corners, a circle, an ellipse or a
 * line.
 *
 * @see [Shape](https://dachajs.org/systems/rendering/components/#shape)
 *
 * @category Rendering
 */
export class Shape extends Component {
  /** Geometry of the shape */
  geometry: ShapeGeometry;
  /** Color of the stroke */
  strokeColor?: string;
  /** Width of the stroke */
  strokeWidth: number;
  /** Alignment of the stroke relative to the path
   *
   * 0 - Outside of the shape
   * 0.5 - Center of the path
   * 1 - Inside of the shape
   */
  strokeAlignment: number;
  /** Whether the shape stroke should remains 1 pixel wide regardless of the scale */
  pixelLine: boolean;
  /** Fill color of the shape */
  fill?: string;
  /** Opacity of the shape */
  opacity: number;
  /** Blending mode of the shape */
  blending: BlendingMode;
  /** Whether the shape is disabled */
  disabled: boolean;
  /** Sorting layer of the shape */
  sortingLayer: string;
  /** Center point of the shape */
  sortOffset: Point;
  /** @internal Rendering data owned by the renderer */
  renderData?: RenderData;

  /**
   * Creates a new Shape component.
   *
   * @param config - Configuration for the shape
   */
  constructor(config: ShapeConfig) {
    super();

    this.strokeColor = config.strokeColor ?? '#ffffff';
    this.strokeWidth = config.strokeWidth ?? 0;
    this.strokeAlignment = config.strokeAlignment ?? 0.5;
    this.pixelLine = config.pixelLine ?? false;
    this.fill = config.fill ?? '#ffffff';
    this.opacity = config.opacity ?? 1;
    this.blending = config.blending ?? 'normal';
    this.disabled = config.disabled ?? false;
    this.sortingLayer = config.sortingLayer ?? 'default';
    this.sortOffset = {
      x: config.sortOffset?.x ?? 0,
      y: config.sortOffset?.y ?? 0,
    };

    switch (config.type) {
      case 'rectangle':
        this.geometry = {
          type: config.type,
          size: { x: config.size?.x ?? 10, y: config.size?.y ?? 10 },
        };
        break;
      case 'roundRectangle':
        this.geometry = {
          type: config.type,
          size: { x: config.size?.x ?? 10, y: config.size?.y ?? 10 },
          radius: config.radius ?? 2,
        };
        break;
      case 'circle':
        this.geometry = {
          type: config.type,
          radius: config.radius ?? 5,
        };
        break;
      case 'ellipse':
        this.geometry = {
          type: config.type,
          radius: { x: config.radius?.x ?? 5, y: config.radius?.y ?? 5 },
        };
        break;
      case 'line':
        this.geometry = {
          type: config.type,
          point1: { x: config.point1?.x ?? -5, y: config.point1?.y ?? 0 },
          point2: { x: config.point2?.x ?? 5, y: config.point2?.y ?? 0 },
        };
    }
  }
}

Shape.componentName = 'Shape';

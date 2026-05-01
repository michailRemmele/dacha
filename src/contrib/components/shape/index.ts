import type { Graphics } from 'pixi.js';

import { Component } from '../../../engine/component';
import type { Point } from '../../../engine/math-lib';
import { type BlendingMode } from '../../types/view';

interface RenderData {
  view: Graphics;
  graphicsContextKey?: string;
}

export type ShapeType =
  | 'rectangle'
  | 'roundRectangle'
  | 'circle'
  | 'ellipse'
  | 'line';

export interface BaseShapeConfig {
  strokeColor?: string;
  strokeWidth: number;
  strokeAlignment: number;
  pixelLine: boolean;
  fill?: string;
  opacity: number;
  blending: BlendingMode;
  disabled: boolean;
  sortingLayer: string;
  sortOffsetX: number;
  sortOffsetY: number;
}

export interface RectangleShapeConfig extends BaseShapeConfig {
  type: 'rectangle';
  sizeX: number;
  sizeY: number;
}

export interface RoundRectangleShapeConfig extends BaseShapeConfig {
  type: 'roundRectangle';
  sizeX: number;
  sizeY: number;
  radius: number;
}

export interface CircleShapeConfig extends BaseShapeConfig {
  type: 'circle';
  radius: number;
}

export interface EllipseShapeConfig extends BaseShapeConfig {
  type: 'ellipse';
  radiusX: number;
  radiusY: number;
}

export interface LineShapeConfig extends BaseShapeConfig {
  type: 'line';
  point1X: number;
  point1Y: number;
  point2X: number;
  point2Y: number;
}

export type ShapeConfig =
  | RectangleShapeConfig
  | RoundRectangleShapeConfig
  | CircleShapeConfig
  | EllipseShapeConfig
  | LineShapeConfig;

export interface RectangleShapeGeometry {
  type: 'rectangle';
  size: Point;
}

export interface RoundRectangleShapeGeometry {
  type: 'roundRectangle';
  size: Point;
  radius: number;
}

export interface CircleShapeGeometry {
  type: 'circle';
  radius: number;
}

export interface EllipseShapeGeometry {
  type: 'ellipse';
  radius: Point;
}

export interface LineShapeGeometry {
  type: 'line';
  point1: Point;
  point2: Point;
}

export type ShapeGeometry =
  | RectangleShapeGeometry
  | RoundRectangleShapeGeometry
  | CircleShapeGeometry
  | EllipseShapeGeometry
  | LineShapeGeometry;

/**
 * Shape component for rendering 2D geometry.
 *
 * Handles the visual representation of an actor using a shape.
 * It can be used to render such shapes as rectangles or circles.
 *
 * @example
 * ```typescript
 * // Create a basic shape
 * const shape = new Shape({
 *   type: 'rectangle',
 *   sizeX: 100,
 *   sizeY: 50,
 *   strokeWidth: 2,
 *   strokeColor: '#000',
 *   strokeAlignment: 0.5,
 *   pixelLine: false,
 *   opacity: 1,
 *   blending: 'normal',
 *   disabled: false,
 *   sortingLayer: 'units',
 *   sortOffsetX: 0,
 *   sortOffsetY: 0,
 * });
 *
 * // Add to actor
 * actor.setComponent(shape);
 *
 * // Modify properties
 * shape.opacity = 0.5; // Make semi-transparent
 * shape.color = '#ff0000'; // Apply a red tint
 * ```
 *
 * @category Components
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
  /** Internal rendering data */
  renderData?: RenderData;

  /**
   * Creates a new Shape component.
   *
   * @param config - Configuration for the shape
   */
  constructor(config: ShapeConfig) {
    super();

    this.strokeColor = config.strokeColor;
    this.strokeWidth = config.strokeWidth;
    this.strokeAlignment = config.strokeAlignment;
    this.pixelLine = config.pixelLine;
    this.fill = config.fill;
    this.opacity = config.opacity;
    this.blending = config.blending;
    this.disabled = config.disabled;
    this.sortingLayer = config.sortingLayer;
    this.sortOffset = { x: config.sortOffsetX, y: config.sortOffsetY };

    switch (config.type) {
      case 'rectangle':
        this.geometry = {
          type: config.type,
          size: { x: config.sizeX, y: config.sizeY },
        };
        break;
      case 'roundRectangle':
        this.geometry = {
          type: config.type,
          size: { x: config.sizeX, y: config.sizeY },
          radius: config.radius,
        };
        break;
      case 'circle':
        this.geometry = {
          type: config.type,
          radius: config.radius,
        };
        break;
      case 'ellipse':
        this.geometry = {
          type: config.type,
          radius: { x: config.radiusX, y: config.radiusY },
        };
        break;
      case 'line':
        this.geometry = {
          type: config.type,
          point1: { x: config.point1X, y: config.point1Y },
          point2: { x: config.point2X, y: config.point2Y },
        };
    }
  }
}

Shape.componentName = 'Shape';

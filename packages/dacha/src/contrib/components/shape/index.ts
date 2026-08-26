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

export interface RectangleShapeConfig extends BaseShapeConfig {
  type: 'rectangle';
  size?: Point;
}

export interface RoundRectangleShapeConfig extends BaseShapeConfig {
  type: 'roundRectangle';
  size?: Point;
  radius?: number;
}

export interface CircleShapeConfig extends BaseShapeConfig {
  type: 'circle';
  radius?: number;
}

export interface EllipseShapeConfig extends BaseShapeConfig {
  type: 'ellipse';
  radius?: Point;
}

export interface LineShapeConfig extends BaseShapeConfig {
  type: 'line';
  point1?: Point;
  point2?: Point;
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
 *   size: { x: 100, y: 50 },
 *   strokeWidth: 2,
 *   strokeColor: '#000',
 *   strokeAlignment: 0.5,
 *   pixelLine: false,
 *   opacity: 1,
 *   blending: 'normal',
 *   disabled: false,
 *   sortingLayer: 'units',
 *   sortOffset: { x: 0, y: 0 },
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

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
  sortOffset: Point;
}

export interface RectangleGeometry {
  type: 'rectangle';
  size: Point;
}

export interface RoundRectangleGeometry {
  type: 'roundRectangle';
  size: Point;
  radius: number;
}

export interface CircleGeometry {
  type: 'circle';
  radius: number;
}

export interface EllipseGeometry {
  type: 'ellipse';
  radius: Point;
}

export interface LineGeometry {
  type: 'line';
  point1: Point;
  point2: Point;
}

export type ShapeGeometry =
  | RectangleGeometry
  | RoundRectangleGeometry
  | CircleGeometry
  | EllipseGeometry
  | LineGeometry;

export type ShapeConfig = BaseShapeConfig & ShapeGeometry;

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
 *   size: { x: 100, y: 100 },
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

    this.strokeColor = config.strokeColor;
    this.strokeWidth = config.strokeWidth;
    this.strokeAlignment = config.strokeAlignment;
    this.pixelLine = config.pixelLine;
    this.fill = config.fill;
    this.opacity = config.opacity;
    this.blending = config.blending;
    this.disabled = config.disabled;
    this.sortingLayer = config.sortingLayer;
    this.sortOffset = { ...config.sortOffset };

    switch (config.type) {
      case 'rectangle':
        this.geometry = {
          type: config.type,
          size: { ...config.size },
        };
        break;
      case 'roundRectangle':
        this.geometry = {
          type: config.type,
          size: { ...config.size },
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
          radius: { ...config.radius },
        };
        break;
      case 'line':
        this.geometry = {
          type: config.type,
          point1: { ...config.point1 },
          point2: { ...config.point2 },
        };
    }
  }

  clone(): Shape {
    const baseConfig = {
      strokeColor: this.strokeColor,
      strokeWidth: this.strokeWidth,
      strokeAlignment: this.strokeAlignment,
      pixelLine: this.pixelLine,
      opacity: this.opacity,
      blending: this.blending,
      disabled: this.disabled,
      sortingLayer: this.sortingLayer,
      sortOffset: { ...this.sortOffset },
      fill: this.fill,
    };

    switch (this.geometry.type) {
      case 'rectangle':
        return new Shape({
          ...baseConfig,
          type: this.geometry.type,
          size: { ...this.geometry.size },
        });
      case 'roundRectangle':
        return new Shape({
          ...baseConfig,
          type: this.geometry.type,
          size: { ...this.geometry.size },
          radius: this.geometry.radius,
        });
      case 'circle':
        return new Shape({
          ...baseConfig,
          type: this.geometry.type,
          radius: this.geometry.radius,
        });
      case 'ellipse':
        return new Shape({
          ...baseConfig,
          type: this.geometry.type,
          radius: { ...this.geometry.radius },
        });
      case 'line':
        return new Shape({
          ...baseConfig,
          type: this.geometry.type,
          point1: { ...this.geometry.point1 },
          point2: { ...this.geometry.point2 },
        });
    }
  }
}

Shape.componentName = 'Shape';

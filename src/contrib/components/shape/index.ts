import type { Graphics } from 'pixi.js';

import { Component } from '../../../engine/component';
import { type BlendingMode } from '../../types/view';

interface RenderData {
  view: Graphics;
  graphicsContextKey?: string;
}

export type ShapeType = 'rectangle' | 'roundRectangle' | 'circle' | 'ellipse';

export interface BaseShape {
  type: ShapeType;
  strokeColor?: string;
  strokeWidth: number;
  strokeAlignment: number;
  pixelLine: boolean;
  fill?: string;
  opacity: number;
  blending: BlendingMode;
  disabled: boolean;
  sortingLayer: string;
  sortCenter: [number, number];
}

export interface Rectangle extends BaseShape {
  type: 'rectangle';
  width: number;
  height: number;
}

export interface RoundRectangle extends BaseShape {
  type: 'roundRectangle';
  width: number;
  height: number;
  radius: number;
}

export interface Circle extends BaseShape {
  type: 'circle';
  radius: number;
}

export interface Ellipse extends BaseShape {
  type: 'ellipse';
  radiusX: number;
  radiusY: number;
}

export type ShapeConfig = BaseShape &
  Partial<Rectangle | RoundRectangle | Circle | Ellipse>;

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
 *   width: 100,
 *   height: 100,
 *   strokeWidth: 2,
 *   strokeColor: '#000',
 *   strokeAlignment: 0.5,
 *   pixelLine: false,
 *   opacity: 1,
 *   blending: 'normal',
 *   disabled: false,
 *   sortingLayer: 'units',
 *   sortCenter: [0, 0],
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
  /** Type of the shape */
  type: ShapeType;
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
  sortCenter: [number, number];
  /** Width of the shape */
  width?: number;
  /** Height of the shape */
  height?: number;
  /** Radius of the shape */
  radius?: number;
  /** Radius X of the shape */
  radiusX?: number;
  /** Radius Y of the shape */
  radiusY?: number;
  /** Internal rendering data */
  renderData?: RenderData;

  /**
   * Creates a new Shape component.
   * 
   * @param config - Configuration for the shape
   */
  constructor(config: ShapeConfig) {
    super();

    this.type = config.type;
    this.strokeColor = config.strokeColor;
    this.strokeWidth = config.strokeWidth;
    this.strokeAlignment = config.strokeAlignment;
    this.pixelLine = config.pixelLine;
    this.fill = config.fill;
    this.opacity = config.opacity;
    this.blending = config.blending;
    this.disabled = config.disabled;
    this.sortingLayer = config.sortingLayer;
    this.sortCenter = config.sortCenter;
    this.width = (config as Rectangle | RoundRectangle).width;
    this.height = (config as Rectangle | RoundRectangle).height;
    this.radius = (config as RoundRectangle | Circle).radius;
    this.radiusX = (config as Ellipse).radiusX;
    this.radiusY = (config as Ellipse).radiusY;
  }

  clone(): Shape {
    return new Shape({
      type: this.type,
      strokeColor: this.strokeColor,
      strokeWidth: this.strokeWidth,
      strokeAlignment: this.strokeAlignment,
      pixelLine: this.pixelLine,
      opacity: this.opacity,
      blending: this.blending,
      disabled: this.disabled,
      sortingLayer: this.sortingLayer,
      sortCenter: this.sortCenter.slice(0) as [number, number],
      width: this.width,
      height: this.height,
      radius: this.radius,
      radiusX: this.radiusX,
      radiusY: this.radiusY,
      fill: this.fill,
    });
  }
}

Shape.componentName = 'Shape';

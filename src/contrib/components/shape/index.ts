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

export class Shape extends Component {
  type: ShapeType;
  strokeColor?: string;
  strokeWidth: number;
  pixelLine: boolean;
  fill?: string;
  opacity: number;
  blending: BlendingMode;
  disabled: boolean;
  sortingLayer: string;
  sortCenter: [number, number];
  width?: number;
  height?: number;
  radius?: number;
  radiusX?: number;
  radiusY?: number;
  renderData?: RenderData;

  constructor(config: ShapeConfig) {
    super();

    this.type = config.type;
    this.strokeColor = config.strokeColor;
    this.strokeWidth = config.strokeWidth;
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
      pixelLine: this.pixelLine,
      opacity: this.opacity,
      blending: this.blending,
      disabled: this.disabled,
      sortingLayer: this.sortingLayer,
      sortCenter: this.sortCenter,
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

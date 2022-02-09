import { Component } from '../../../engine/component';

type RenderableType = 'sprite' | 'static';
type FitType = 'stretch' | 'repeat';

export interface RenderableConfig {
  src: string;
  width: number;
  height: number;
  type: RenderableType;
  slice?: number;
  spacing: number;
  extruding: number;
  rotation: number;
  flipX: boolean;
  flipY: boolean;
  disabled: boolean;
  sortingLayer: string;
  sortCenter: [number, number];
  fit: FitType;
}

export class Renderable extends Component {
  src: string;
  width: number;
  height: number;
  type: RenderableType;
  slice?: number;
  spacing: number;
  extruding: number;
  rotation: number;
  flipX: boolean;
  flipY: boolean;
  disabled: boolean;
  sortingLayer: string;
  sortCenter: [number, number];
  currentFrame?: number;
  fit: FitType;

  constructor(componentName: string, config: RenderableConfig) {
    super(componentName);

    this.src = config.src;
    this.width = config.width;
    this.height = config.height;
    this.type = config.type;
    this.slice = config.slice;
    this.spacing = config.spacing || 0;
    this.extruding = config.extruding || 0;
    this.currentFrame = config.type === 'sprite' ? 0 : void 0;
    this.rotation = config.rotation;
    this.flipX = config.flipX;
    this.flipY = config.flipY;
    this.disabled = config.disabled;
    this.sortingLayer = config.sortingLayer;
    this.sortCenter = config.sortCenter;
    this.fit = config.fit;
  }

  clone() {
    return new Renderable(this.componentName, {
      src: this.src,
      width: this.width,
      height: this.height,
      type: this.type,
      slice: this.slice,
      spacing: this.spacing,
      extruding: this.extruding,
      rotation: this.rotation,
      flipX: this.flipX,
      flipY: this.flipY,
      disabled: this.disabled,
      sortingLayer: this.sortingLayer,
      sortCenter: this.sortCenter.slice(0) as [number, number],
      fit: this.fit,
    });
  }
}

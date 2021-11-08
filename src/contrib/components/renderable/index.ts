import { Component } from '../../../engine/component';

type RenderableType = 'sprite' | 'static';

interface RenderableConfig {
  src: string;
  width: number;
  height: number;
  type: RenderableType;
  slice?: number;
  spacing: number;
  extruding: number;
  rotation: number;
  origin: [number, number];
  flipX: boolean;
  flipY: boolean;
  disabled: boolean;
  sortingLayer: string;
}

export class Renderable extends Component {
  private _origin: [number, number];

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
  currentFrame?: number;

  constructor(componentName: string, config: RenderableConfig) {
    super(componentName);

    this.src = config.src;
    this.width = config.width;
    this.height = config.height;
    this.type = config.type;
    this.slice = config.slice;
    this.spacing = config.spacing || 0;
    this.extruding = config.extruding || 0;
    this.currentFrame = config.type === 'sprite' ? 0 : undefined;
    this.rotation = config.rotation;
    this._origin = config.origin;
    this.flipX = config.flipX;
    this.flipY = config.flipY;
    this.disabled = config.disabled;
    this.sortingLayer = config.sortingLayer;
  }

  set origin(origin: [number, number]) {
    this._origin = origin;
  }

  get origin() {
    return [this._origin[0] - (this.width / 2), this._origin[1] - (this.height / 2)];
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
      origin: this._origin.slice(0) as [number, number],
      flipX: this.flipX,
      flipY: this.flipY,
      disabled: this.disabled,
      sortingLayer: this.sortingLayer,
    });
  }
}

export default Renderable;

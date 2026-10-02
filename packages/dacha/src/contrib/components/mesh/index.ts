import type { Mesh as PixiMesh } from 'pixi.js';

import { Component } from '../../../engine/component';
import { DefineComponent, DefineField } from '../../../engine/decorators';
import { sortingLayerOptions } from '../../systems/renderer/sorting-layer-options';
import type { Point } from '../../../engine/math-lib';
import { type BlendingMode } from '../../systems/renderer/blending-mode';

interface RenderData {
  view: PixiMesh;
  textureSourceKey?: string;
  textureArrayKey?: string;
}

export { type BlendingMode } from '../../systems/renderer/blending-mode';

/**
 * The shader of a {@link Mesh} with its options.
 *
 * @category Rendering
 */
export interface MaterialConfig {
  /** The `shaderName` of the shader class. */
  name: string;
  /** The values of the shader fields. The shader methods get them as `options`. */
  options: Record<string, unknown>;
}

/**
 * Options for {@link Mesh}.
 *
 * @category Rendering
 */
export interface MeshConfig {
  src?: string;
  width?: number;
  height?: number;
  slice?: number;
  flipX?: boolean;
  flipY?: boolean;
  sortingLayer?: string;
  sortOffset?: Point;
  color?: string;
  blending?: BlendingMode;
  opacity?: number;
  material?: MaterialConfig;
  disabled?: boolean;
}

/**
 * Draws an image with your own shader. `material` sets the shader.
 *
 * @see [Shaders](https://dachajs.org/systems/rendering/shaders/)
 *
 * @category Rendering
 */
@DefineComponent({
  name: 'Mesh',
  icon: 'VectorSquare',
  sections: { texture: { defaultOpen: true } },
})
export class Mesh extends Component {
  /** Path to the texture image file */
  @DefineField({
    type: 'file',
    initialValue: '',
    section: 'texture',
    extensions: ['png'],
  })
  src: string;
  /** Width of the mesh in pixels */
  @DefineField({ initialValue: 10, section: 'texture' })
  width: number;
  /** Height of the mesh in pixels */
  @DefineField({ initialValue: 10, section: 'texture' })
  height: number;
  /** Number of frames in the sprite sheet */
  @DefineField({ initialValue: 1, section: 'texture' })
  slice: number;
  /** Whether to flip the mesh horizontally */
  @DefineField({ initialValue: false, section: 'texture' })
  flipX: boolean;
  /** Whether to flip the mesh vertically */
  @DefineField({ initialValue: false, section: 'texture' })
  flipY: boolean;
  /** Color tint applied to the mesh */
  @DefineField({
    type: 'color',
    initialValue: '#fff',
    section: 'appearance',
    disabledAlpha: true,
  })
  color: string;
  /** Blending mode for rendering */
  @DefineField({
    type: 'select',
    initialValue: 'normal',
    section: 'appearance',
    options: ['normal', 'addition', 'subtract', 'multiply'],
  })
  blending: BlendingMode;
  /** Opacity from 0 (transparent) to 1 (opaque) */
  @DefineField({ initialValue: 1, section: 'appearance' })
  opacity: number;
  /** Center point for sorting calculations */
  @DefineField({ initialValue: { x: 0, y: 0 }, section: 'sorting' })
  sortOffset: Point;
  /** Sorting layer name for rendering order */
  @DefineField({
    type: 'select',
    initialValue: 'default',
    section: 'sorting',
    options: sortingLayerOptions,
  })
  sortingLayer: string;
  /** Whether the mesh is disabled and should not render */
  @DefineField({ initialValue: false })
  disabled: boolean;

  /** Current frame to render */
  currentFrame: number;
  /** Material describes a shader and its options applied to a texture (optional). */
  @DefineField({
    type: 'script',
    kind: 'shader',
    section: 'material',
  })
  material?: MaterialConfig;
  /** @internal Rendering data owned by the renderer */
  renderData?: RenderData;

  /**
   * Creates a new Mesh component.
   *
   * @param config - Configuration for the mesh
   */
  constructor(config: MeshConfig) {
    super();

    this.src = config.src ?? '';
    this.width = config.width ?? 10;
    this.height = config.height ?? 10;
    this.slice = config.slice ?? 1;
    this.currentFrame = 0;
    this.flipX = config.flipX ?? false;
    this.flipY = config.flipY ?? false;
    this.disabled = config.disabled ?? false;
    this.sortingLayer = config.sortingLayer ?? 'default';
    this.sortOffset = {
      x: config.sortOffset?.x ?? 0,
      y: config.sortOffset?.y ?? 0,
    };
    this.color = config.color ?? '#ffffff';
    this.blending = config.blending ?? 'normal';
    this.opacity = config.opacity ?? 1;
    this.material = config.material
      ? { name: config.material.name, options: { ...config.material.options } }
      : undefined;
  }
}

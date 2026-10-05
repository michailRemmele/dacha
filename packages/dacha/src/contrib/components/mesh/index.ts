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
export class Mesh extends Component<MeshConfig> {
  /** Path to the texture image file */
  @DefineField({
    type: 'file',
    initialValue: '',
    section: 'texture',
    extensions: ['png'],
  })
  src!: string;
  /** Width of the mesh in pixels */
  @DefineField({ initialValue: 10, section: 'texture' })
  width!: number;
  /** Height of the mesh in pixels */
  @DefineField({ initialValue: 10, section: 'texture' })
  height!: number;
  /** Number of frames in the sprite sheet */
  @DefineField({ initialValue: 1, section: 'texture' })
  slice!: number;
  /** Whether to flip the mesh horizontally */
  @DefineField({ initialValue: false, section: 'texture' })
  flipX!: boolean;
  /** Whether to flip the mesh vertically */
  @DefineField({ initialValue: false, section: 'texture' })
  flipY!: boolean;
  /** Color tint applied to the mesh */
  @DefineField({
    type: 'color',
    initialValue: '#ffffff',
    section: 'appearance',
    disabledAlpha: true,
  })
  color!: string;
  /** Blending mode for rendering */
  @DefineField({
    type: 'select',
    initialValue: 'normal',
    section: 'appearance',
    options: ['normal', 'addition', 'subtract', 'multiply'],
  })
  blending!: BlendingMode;
  /** Opacity from 0 (transparent) to 1 (opaque) */
  @DefineField({ initialValue: 1, section: 'appearance' })
  opacity!: number;
  /** Center point for sorting calculations */
  @DefineField({ initialValue: { x: 0, y: 0 }, section: 'sorting' })
  sortOffset!: Point;
  /** Sorting layer name for rendering order */
  @DefineField({
    type: 'select',
    initialValue: 'default',
    section: 'sorting',
    options: sortingLayerOptions,
  })
  sortingLayer!: string;
  /** Whether the mesh is disabled and should not render */
  @DefineField({ initialValue: false })
  disabled!: boolean;

  /** Current frame to render */
  currentFrame = 0;
  /** Material describes a shader and its options applied to a texture (optional). */
  @DefineField({
    type: 'script',
    kind: 'shader',
    title: 'Shader',
    section: 'material',
  })
  material?: MaterialConfig;
  /** @internal Rendering data owned by the renderer */
  renderData?: RenderData;
}

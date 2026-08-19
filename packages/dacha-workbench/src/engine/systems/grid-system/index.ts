import {
  SceneSystem,
  Transform,
  Camera,
  PixiView,
  type SceneSystemOptions,
  type Actor,
} from 'dacha';
import { Graphics, Filter, GlProgram, defaultFilterVert, Color } from 'pixi.js';

import { Settings } from '../../components';

import { getGridFragmentShader } from './utils';

interface PrevState {
  gridStep?: number;
  gridColor?: string;
  zoom?: number;
  windowSizeX?: number;
  windowSizeY?: number;
}

export class GridSystem extends SceneSystem {
  private mainActor: Actor;
  private gridActor: Actor;
  private gridView?: Graphics;

  private prevState: PrevState;

  constructor(options: SceneSystemOptions) {
    super();

    const { world } = options;

    this.mainActor = world.data.mainActor as Actor;
    this.gridActor = this.mainActor.findChildById('grid')!;

    this.gridActor.setComponent(
      new PixiView({
        createView: (): Graphics => {
          const gridView = new Graphics();
          gridView.rect(-1, -1, 2, 2).fill({ color: 'transparent' });
          gridView.filters = [
            new Filter({
              glProgram: new GlProgram({
                fragment: getGridFragmentShader(),
                vertex: defaultFilterVert,
              }),
              resources: {
                myUniforms: {
                  u_graphic_resolution: {
                    type: 'vec2<f32>',
                    value: [0, 0],
                  },
                  u_spacing: {
                    type: 'f32',
                    value: 0,
                  },
                  u_camera_zoom: {
                    type: 'f32',
                    value: 1,
                  },
                  u_offset: {
                    type: 'vec2<f32>',
                    value: [0, 0],
                  },
                  u_line_color: {
                    type: 'vec4<f32>',
                    value: [1, 1, 1, 1],
                  },
                },
              },
            }),
          ];

          this.gridView = gridView;
          this.updateGridSettings();

          return gridView;
        },
        sortingLayer: 'editor-layer-1',
        sortOffsetX: 0,
        sortOffsetY: 0,
      }),
    );

    this.prevState = {};
  }

  private isGridChanged(): boolean {
    const settings = this.mainActor.getComponent(Settings);

    const gridStep = settings.data.gridStep as number;
    const gridColor = settings.data.gridColor as string;

    const { zoom, windowSizeX, windowSizeY } =
      this.mainActor.getComponent(Camera);

    let isChanged = false;

    if (
      zoom !== this.prevState.zoom ||
      gridStep !== this.prevState.gridStep ||
      gridColor !== this.prevState.gridColor ||
      windowSizeX !== this.prevState.windowSizeX ||
      windowSizeY !== this.prevState.windowSizeY
    ) {
      isChanged = true;
      this.prevState.zoom = zoom;
      this.prevState.gridStep = gridStep;
      this.prevState.gridColor = gridColor;
      this.prevState.windowSizeX = windowSizeX;
      this.prevState.windowSizeY = windowSizeY;
    }

    return isChanged;
  }

  private updateGridSettings(): void {
    if (!this.gridView) {
      return;
    }

    const settings = this.mainActor.getComponent(Settings);

    const gridStep = settings.data.gridStep as number;
    const gridColor = settings.data.gridColor as string;

    const { zoom, windowSizeX, windowSizeY } =
      this.mainActor.getComponent(Camera);

    const uniforms = this.gridView.filters[0].resources.myUniforms.uniforms;

    uniforms.u_graphic_resolution = [windowSizeX, windowSizeY];
    uniforms.u_camera_zoom = zoom * devicePixelRatio;
    uniforms.u_spacing = gridStep;
    uniforms.u_line_color = new Color(gridColor).toArray();
  }

  update(): void {
    if (!this.gridView) {
      return;
    }

    const settings = this.mainActor.getComponent(Settings);
    const showGrid = settings.data.showGrid as boolean;

    this.gridView.renderable = showGrid;

    if (!showGrid) {
      return;
    }

    const { zoom, windowSizeX, windowSizeY } =
      this.mainActor.getComponent(Camera);
    const {
      world: { position },
    } = this.gridActor.getComponent(Transform);

    const uniforms = this.gridView.filters[0].resources.myUniforms.uniforms;
    uniforms.u_offset = [position.x, position.y];

    const shouldUpdateGrid = this.isGridChanged();
    if (shouldUpdateGrid) {
      this.gridView.setSize(windowSizeX / zoom, windowSizeY / zoom);
      this.updateGridSettings();
    }
  }
}

GridSystem.systemName = 'GridSystem';

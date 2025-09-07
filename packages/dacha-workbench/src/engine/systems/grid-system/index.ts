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
}

export class GridSystem extends SceneSystem {
  private mainActor: Actor;
  private gridActor: Actor;
  private gridView: Graphics;

  private prevState: PrevState;

  constructor(options: SceneSystemOptions) {
    super();

    const { world } = options;

    this.mainActor = world.data.mainActor as Actor;
    this.gridActor = this.mainActor.findChildById('grid')!;

    this.gridView = new Graphics();
    this.gridView.rect(-1, -1, 2, 2).fill({ color: 'transparent' });
    this.gridView.filters = [
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

    this.gridActor.setComponent(
      new PixiView({
        buildView: (): Graphics => this.gridView,
        sortingLayer: 'editor-layer-1',
        sortCenter: [0, 0],
      }),
    );

    this.prevState = {};

    window.addEventListener('resize', this.handleWindowResize);
  }

  onSceneEnter(): void {
    this.handleWindowResize();
  }

  onWorldDestroy(): void {
    window.removeEventListener('resize', this.handleWindowResize);
  }

  private handleWindowResize = (): void => {
    const { windowSizeX, windowSizeY, zoom } =
      this.mainActor.getComponent(Camera);

    const uniforms = this.gridView.filters[0].resources.myUniforms.uniforms;

    uniforms.u_graphic_resolution = [windowSizeX, windowSizeY];
    this.gridView.setSize(windowSizeX / zoom, windowSizeY / zoom);
  };

  private isGridChanged(): boolean {
    const settings = this.mainActor.getComponent(Settings);

    const gridStep = settings.data.gridStep as number;
    const gridColor = settings.data.gridColor as string;

    const { zoom } = this.mainActor.getComponent(Camera);

    let isChanged = false;

    if (
      zoom !== this.prevState.zoom ||
      gridStep !== this.prevState.gridStep ||
      gridColor !== this.prevState.gridColor
    ) {
      isChanged = true;
      this.prevState.zoom = zoom;
      this.prevState.gridStep = gridStep;
      this.prevState.gridColor = gridColor;
    }

    return isChanged;
  }

  private updateGridSettings(): void {
    const settings = this.mainActor.getComponent(Settings);

    const gridStep = settings.data.gridStep as number;
    const gridColor = settings.data.gridColor as string;

    const { zoom } = this.mainActor.getComponent(Camera);

    const uniforms = this.gridView.filters[0].resources.myUniforms.uniforms;

    uniforms.u_camera_zoom = zoom * devicePixelRatio;
    uniforms.u_spacing = gridStep;
    uniforms.u_line_color = new Color(gridColor).toArray();
  }

  update(): void {
    const settings = this.mainActor.getComponent(Settings);
    const showGrid = settings.data.showGrid as boolean;

    this.gridView.renderable = showGrid;

    if (!showGrid) {
      return;
    }

    const { zoom, windowSizeX, windowSizeY } =
      this.mainActor.getComponent(Camera);
    const { offsetX, offsetY } = this.gridActor.getComponent(Transform);

    this.gridView.position.set(offsetX, offsetY);

    const uniforms = this.gridView.filters[0].resources.myUniforms.uniforms;
    uniforms.u_offset = [offsetX, offsetY];

    const shouldUpdateGrid = this.isGridChanged();
    if (shouldUpdateGrid) {
      this.gridView.setSize(windowSizeX / zoom, windowSizeY / zoom);
      this.updateGridSettings();
    }
  }
}

GridSystem.systemName = 'GridSystem';

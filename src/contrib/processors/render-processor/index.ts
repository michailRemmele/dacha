import { GameObject, GameObjectObserver } from '../../../engine/gameObject';
import { Store } from '../../../engine/scene';
import { Renderable } from '../../components/renderable';
import { Transform } from '../../components/transform';
import { Camera } from '../../components/camera';

import { Rectangle } from './geometry/rectangle';
import { Color } from './color';
import { textureHandlers, TextureHandler, TextureDescriptor } from './texture-handlers';
import { ShaderBuilder, VERTEX_SHADER, FRAGMENT_SHADER } from './shader-builder';
import { MatrixTransformer, Matrix3x3 } from './matrix-transformer';
import {
  composeSort,
  SortFn,
  createSortByLayer,
  sortByYAxis,
  sortByXAxis,
  sortByZAxis,
} from './sort';
import {
  MAX_COLOR_NUMBER,
  DRAW_OFFSET,
  DRAW_COUNT,
  STD_SCREEN_SIZE,
  VECTOR_2_SIZE,
  BYTES_PER_VECTOR_2,
  MATRIX_ROW_SIZE,
  MATRIX_SIZE,
  BYTES_PER_MATRIX,
  BYTES_PER_MATRIX_ROW,
  VERTEX_STRIDE,
  VERTEX_DATA_STRIDE,
  BUFFER_SIZE,
  RENDERABLE_COMPONENT_NAME,
  TRANSFORM_COMPONENT_NAME,
  CAMERA_COMPONENT_NAME,
  CURRENT_CAMERA_NAME,
} from './consts';

interface ViewMatrixStats {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  scale?: number;
}

interface RendererOptions {
  window: HTMLElement;
  textureAtlas: HTMLImageElement;
  textureAtlasDescriptor: Record<string, TextureDescriptor>;
  backgroundColor: string;
  gameObjectObserver: GameObjectObserver;
  sortingLayers: Array<string>;
  store: Store;
  scaleSensitivity: number;
}

export { TextureDescriptor } from './texture-handlers';

export class RenderProcessor {
  private textureAtlas: HTMLImageElement;
  private textureAtlasSize: {
    width: number;
    height: number;
  };
  private textureAtlasDescriptor: Record<string, TextureDescriptor>;
  private textureHandlers: Record<string, TextureHandler>;
  private _matrixTransformer: MatrixTransformer;
  private _backgroundColor: Color;
  private _view: HTMLCanvasElement;
  private _viewWidth: number;
  private _viewHeight: number;
  private _windowDidResize: boolean;
  private _onWindowResizeBind: () => void;
  private _shaders: Array<WebGLShader>;
  private _store: Store;
  private _gameObjectObserver: GameObjectObserver;
  private _scaleSensitivity: number;
  private _screenScale: number;
  private _vaoExt: OES_vertex_array_object | null;
  private _buffer: WebGLBuffer | null;
  private _vao: WebGLVertexArrayObjectOES | null;
  private _geometry: Record<string, {
    position: Array<number>;
    texCoord: Array<number>;
  } | null>;
  private _viewMatrixStats: ViewMatrixStats;
  private _vertexData: Float32Array | null;
  private _gameObjectsCount: number;
  private gl: WebGL2RenderingContext | null;
  private program: WebGLProgram | null;
  private textures: WebGLTexture | null;
  private _variables: Record<string, number | WebGLUniformLocation | null>;
  private sortFn: SortFn;

  constructor(options: RendererOptions) {
    const {
      window, textureAtlas,
      textureAtlasDescriptor, backgroundColor,
      gameObjectObserver, sortingLayers,
      store, scaleSensitivity,
    } = options;

    this.textureAtlas = textureAtlas;
    this.textureAtlasSize = {
      width: this.textureAtlas.width,
      height: this.textureAtlas.height,
    };
    this.textureAtlasDescriptor = textureAtlasDescriptor;
    this.textureHandlers = Object
      .keys(textureHandlers)
      .reduce((storage: Record<string, TextureHandler>, key) => {
        const TextureHandlerClass = textureHandlers[key as 'static' | 'sprite'];
        storage[key] = new TextureHandlerClass();
        return storage;
      }, {});

    this._matrixTransformer = new MatrixTransformer();

    this._backgroundColor = new Color(backgroundColor);

    this._view = window as HTMLCanvasElement;
    this._viewWidth = 0;
    this._viewHeight = 0;

    this._windowDidResize = true;
    this._onWindowResizeBind = this._onWindowResize.bind(this);

    this.gl = null;
    this.program = null;
    this.textures = null;
    this._shaders = [];
    this._variables = {};

    this.sortFn = composeSort([
      createSortByLayer(sortingLayers),
      sortByYAxis,
      sortByXAxis,
      sortByZAxis,
    ]);

    this._store = store;
    this._gameObjectObserver = gameObjectObserver;

    this._scaleSensitivity = Math.min(Math.max(scaleSensitivity, 0), 100) / 100;
    this._screenScale = 1;

    this._vaoExt = null;

    this._buffer = null;
    this._vao = null;

    this._geometry = {};
    this._viewMatrixStats = {};

    this._vertexData = null;
    this._gameObjectsCount = 0;
  }

  processorDidMount() {
    window.addEventListener('resize', this._onWindowResizeBind);
    this.gl = this._initGraphicContext();
    this._initExtensions();
    this._initScreen();
    this.program = this._initShaders();
    this._initProgramInfo();
    this.textures = this._initTextures();
  }

  processorWillUnmount() {
    window.removeEventListener('resize', this._onWindowResizeBind);
    this._shaders.forEach((shader) => {
      if (this.program) {
        this.gl?.detachShader(this.program, shader);
      }
      this.gl?.deleteShader(shader);
    });
    this.gl?.deleteProgram(this.program);
    this.gl?.deleteTexture(this.textures);

    // eslint-disable-next-line no-bitwise
    this.gl?.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this._buffer = null;
    this._shaders = [];
    this.program = null;
    this.textures = null;
    this.gl = null;
    this._vao = null;
    this._vaoExt = null;
    this._geometry = {};
    this._viewMatrixStats = {};
    this._vertexData = null;
    this._gameObjectsCount = 0;
  }

  _onWindowResize() {
    this._windowDidResize = true;
  }

  _initGraphicContext() {
    let graphicContext: RenderingContext | null = null;

    try {
      graphicContext = this._view.getContext('webgl')
        || this._view.getContext('experimental-webgl');
    } catch (e) {
      throw new Error('Unable to get graphic context.');
    }

    if (!graphicContext) {
      throw new Error('Unable to initialize WebGL. Your browser may not support it.');
    }

    return graphicContext as WebGL2RenderingContext;
  }

  _initExtensions() {
    if (!this.gl) {
      throw new Error('Unable to initialize extension. The graphic context is not initialized');
    }

    const vaoExt = this.gl.getExtension('OES_vertex_array_object');

    if (!vaoExt) {
      throw new Error('Unable to initialize extension.');
    }

    this._vaoExt = vaoExt;
  }

  _initScreen() {
    if (!this.gl) {
      throw new Error('Unable to initialize screen. The graphic context is not initialized.');
    }

    this.gl.clearColor(
      this._backgroundColor.red() / MAX_COLOR_NUMBER,
      this._backgroundColor.green() / MAX_COLOR_NUMBER,
      this._backgroundColor.blue() / MAX_COLOR_NUMBER,
      1.0,
    );
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    this.gl.depthFunc(this.gl.LEQUAL);
    // eslint-disable-next-line no-bitwise
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }

  _initShaders() {
    if (!this.gl) {
      throw new Error('Unable to initialize shaders. The graphic context is not initialized');
    }

    const shaderBuilder = new ShaderBuilder(this.gl);

    const vertexShader = shaderBuilder.create(VERTEX_SHADER);
    const fragmentShader = shaderBuilder.create(FRAGMENT_SHADER);

    const shaderProgram = this.gl.createProgram();

    if (!shaderProgram) {
      throw new Error('Can\'t create shader program');
    }

    this.gl.attachShader(shaderProgram, vertexShader);
    this.gl.attachShader(shaderProgram, fragmentShader);

    this.gl.linkProgram(shaderProgram);

    if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
      throw new Error('Unable to initialize the shader program.');
    }

    this._shaders.push(vertexShader, fragmentShader);

    return shaderProgram;
  }

  _initProgramInfo() {
    if (!this.gl) {
      throw new Error('Unable to activate program. The graphic context is not initialized');
    }
    if (!this.program) {
      throw new Error('Unable to activate program. The program is not initialized');
    }

    this.gl.useProgram(this.program);

    this._variables = {
      aPosition: this.gl.getAttribLocation(this.program, 'a_position'),
      aTexCoord: this.gl.getAttribLocation(this.program, 'a_texCoord'),
      aModelViewMatrix: this.gl.getAttribLocation(this.program, 'a_modelViewMatrix'),
      aTexSize: this.gl.getAttribLocation(this.program, 'a_texSize'),
      aTexTranslate: this.gl.getAttribLocation(this.program, 'a_texTranslate'),
      aGameObjectSize: this.gl.getAttribLocation(this.program, 'a_gameObjectSize'),
      uViewMatrix: this.gl.getUniformLocation(this.program, 'u_viewMatrix'),
      uTexAtlasSize: this.gl.getUniformLocation(this.program, 'u_texAtlasSize'),
    };

    this._buffer = this.gl.createBuffer();
    this._vao = this._createVAO();

    this._setUpGlobalUniforms();
  }

  _createVAO() {
    if (!this.gl) {
      throw new Error('Unable to create Vertex Array Object. The graphic context is not initialized');
    }
    if (!this._vaoExt) {
      throw new Error('Unable to create Vertex Array Object. VAO extension is not available');
    }

    const vao = this._vaoExt.createVertexArrayOES();
    this._vaoExt.bindVertexArrayOES(vao);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this._buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, BUFFER_SIZE, this.gl.DYNAMIC_DRAW);

    const attrs = [
      {
        loc: this._variables.aPosition as number,
        type: 'vec2',
      },
      {
        loc: this._variables.aTexCoord as number,
        type: 'vec2',
      },
      {
        loc: this._variables.aModelViewMatrix as number,
        type: 'mat3',
      },
      {
        loc: this._variables.aTexSize as number,
        type: 'vec2',
      },
      {
        loc: this._variables.aTexTranslate as number,
        type: 'vec2',
      },
      {
        loc: this._variables.aGameObjectSize as number,
        type: 'vec2',
      },
    ];
    const sizeMap = {
      mat3: BYTES_PER_MATRIX,
      vec2: BYTES_PER_VECTOR_2,
    };
    const stride = attrs.reduce((totalSize, attr) => (
      totalSize + sizeMap[attr.type as 'vec2' | 'mat3']
    ), 0);

    let offset = 0;
    for (let i = 0; i < attrs.length; i += 1) {
      if (attrs[i].type === 'vec2') {
        this.gl.enableVertexAttribArray(attrs[i].loc);
        this.gl.vertexAttribPointer(
          attrs[i].loc,
          VECTOR_2_SIZE,
          this.gl.FLOAT,
          false,
          stride,
          offset,
        );

        offset += BYTES_PER_VECTOR_2;
      } else if (attrs[i].type === 'mat3') {
        for (let j = 0; j < MATRIX_ROW_SIZE; j += 1) {
          const loc = attrs[i].loc + j;

          this.gl.enableVertexAttribArray(loc);
          this.gl.vertexAttribPointer(
            loc,
            MATRIX_ROW_SIZE,
            this.gl.FLOAT,
            false,
            stride,
            offset + (j * BYTES_PER_MATRIX_ROW),
          );
        }

        offset += BYTES_PER_MATRIX;
      }
    }

    this._vaoExt.bindVertexArrayOES(null);

    return vao;
  }

  _setUpGlobalUniforms() {
    if (!this.gl) {
      throw new Error('Unable to set up global uniforms. The graphic context is not initialized');
    }

    this.gl.uniform2fv(
      this._variables.uTexAtlasSize,
      [this.textureAtlasSize.width, this.textureAtlasSize.height],
    );
  }

  _initTextures() {
    if (!this.gl) {
      throw new Error('Unable to initialize textures. The graphic context is not initialized');
    }

    const texture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);

    this.gl.texImage2D(
      this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.textureAtlas,
    );

    return texture;
  }

  _getModelViewMatrix(
    renderable: Renderable,
    x: number,
    y: number,
    rotation: number,
    scaleX: number,
    scaleY: number,
  ) {
    const matrixTransformer = this._matrixTransformer;

    const matrix = matrixTransformer.getIdentityMatrix();

    matrixTransformer.translate(matrix, renderable.origin[0], renderable.origin[1]);
    matrixTransformer.scale(matrix, scaleX, scaleY);
    if (renderable.flipX) {
      matrixTransformer.flipX(matrix);
    }
    if (renderable.flipY) {
      matrixTransformer.flipY(matrix);
    }
    matrixTransformer.rotate(matrix, (renderable.rotation + rotation) % 360);
    matrixTransformer.translate(matrix, x, y);

    return matrix;
  }

  _setUpTextureInfo(textureInfo: TextureDescriptor, renderable: Renderable, offset: number) {
    const vertexData = this._vertexData as Float32Array;

    vertexData[offset] = textureInfo.width;
    vertexData[offset + 1] = textureInfo.height;
    vertexData[offset + 2] = textureInfo.x;
    vertexData[offset + 3] = textureInfo.y;
    vertexData[offset + 4] = renderable.width;
    vertexData[offset + 5] = renderable.height;
  }

  _setUpMatrix(matrix: Matrix3x3, offset: number) {
    const vertexData = this._vertexData as Float32Array;

    /* eslint-disable prefer-destructuring */
    vertexData[offset] = matrix[0];
    vertexData[offset + 1] = matrix[1];
    vertexData[offset + 2] = matrix[2];
    vertexData[offset + 3] = matrix[3];
    vertexData[offset + 4] = matrix[4];
    vertexData[offset + 5] = matrix[5];
    vertexData[offset + 6] = matrix[6];
    vertexData[offset + 7] = matrix[7];
    vertexData[offset + 8] = matrix[8];
    /* eslint-enable prefer-destructuring */
  }

  _setUpVertexData(gameObject: GameObject, index: number) {
    const vertexData = this._vertexData as Float32Array;
    const gameObjectId = gameObject.getId();
    const renderable = gameObject.getComponent(RENDERABLE_COMPONENT_NAME) as Renderable;
    const offset = index * VERTEX_DATA_STRIDE;

    if (renderable.disabled) {
      for (let i = 0; i < VERTEX_DATA_STRIDE; i += 1) {
        vertexData[offset + i] = 0;
      }
      return;
    }

    const transform = gameObject.getComponent(TRANSFORM_COMPONENT_NAME) as Transform;
    const texture = this.textureAtlasDescriptor[renderable.src];
    const textureInfo = this.textureHandlers[renderable.type].handle(texture, renderable);

    const modelViewMatrix = this._getModelViewMatrix(
      renderable,
      transform.offsetX,
      transform.offsetY,
      transform.rotation,
      transform.scaleX,
      transform.scaleY,
    );

    const geometry = this._geometry[gameObjectId] || {
      position: new Rectangle(renderable.width, renderable.height).toArray(),
      texCoord: new Rectangle(textureInfo.width, textureInfo.height).toArray(),
    };
    this._geometry[gameObjectId] = geometry;

    const { position, texCoord } = geometry;

    for (let i = 0, j = offset; i < position.length; i += 2, j += VERTEX_STRIDE) {
      vertexData[j] = position[i];
      vertexData[j + 1] = position[i + 1];
      vertexData[j + 2] = texCoord[i];
      vertexData[j + 3] = texCoord[i + 1];

      this._setUpMatrix(modelViewMatrix, j + (VECTOR_2_SIZE * 2));
      this._setUpTextureInfo(textureInfo, renderable, j + (VECTOR_2_SIZE * 2) + MATRIX_SIZE);
    }
  }

  _resizeCanvas(canvas: HTMLCanvasElement) {
    if (!this._windowDidResize) {
      return;
    }

    const gl = this.gl as WebGLRenderingContext;
    const devicePixelRatio = window.devicePixelRatio || 1;
    this._viewWidth = this._view.clientWidth;
    this._viewHeight = this._view.clientHeight;

    const canvasWidth = this._viewWidth * devicePixelRatio;
    const canvasHeight = this._viewHeight * devicePixelRatio;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const screenSize = Math.sqrt(
      Math.pow(canvas.clientWidth, 2) + Math.pow(canvas.clientHeight, 2),
    );
    const avaragingValue = 1 - this._scaleSensitivity;
    const normalizedSize = screenSize - ((screenSize - STD_SCREEN_SIZE) * avaragingValue);

    this._screenScale = normalizedSize / STD_SCREEN_SIZE;

    gl.viewport(0, 0, canvasWidth, canvasHeight);

    this._windowDidResize = false;
  }

  _updateViewMatrix() {
    const gl = this.gl as WebGLRenderingContext;
    const currentCamera = this._store.get(CURRENT_CAMERA_NAME) as GameObject;
    const transform = currentCamera.getComponent(TRANSFORM_COMPONENT_NAME) as Transform;
    const { zoom } = currentCamera.getComponent(CAMERA_COMPONENT_NAME) as Camera;
    const scale = zoom * this._screenScale;

    const prevStats = this._viewMatrixStats;

    if (
      prevStats.x === transform.offsetX
      && prevStats.y === transform.offsetY
      && prevStats.width === this._viewWidth
      && prevStats.height === this._viewHeight
      && prevStats.scale === scale
    ) {
      return;
    }

    const matrixTransformer = this._matrixTransformer;
    const viewMatrix = matrixTransformer.getIdentityMatrix();
    matrixTransformer.translate(viewMatrix, -transform.offsetX, -transform.offsetY);
    matrixTransformer.scale(viewMatrix, scale, scale);
    matrixTransformer.project(viewMatrix, this._viewWidth, this._viewHeight);

    gl.uniformMatrix3fv(
      this._variables.uViewMatrix,
      false,
      viewMatrix,
    );

    this._viewMatrixStats.width = this._viewWidth;
    this._viewMatrixStats.height = this._viewHeight;
    this._viewMatrixStats.x = transform.offsetX;
    this._viewMatrixStats.y = transform.offsetY;
    this._viewMatrixStats.scale = scale;
  }

  _allocateVertexData() {
    const gameObjectsCount = this._gameObjectObserver.size();
    if (this._gameObjectsCount !== gameObjectsCount) {
      this._gameObjectsCount = gameObjectsCount;
      this._vertexData = new Float32Array(this._gameObjectsCount * VERTEX_DATA_STRIDE);
    }
  }

  _setUpBuffers() {
    const vaoExt = this._vaoExt as OES_vertex_array_object;
    const gl = this.gl as WebGLRenderingContext;
    const vertexData = this._vertexData as Float32Array;

    vaoExt.bindVertexArrayOES(this._vao);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertexData);
  }

  _processRemovedGameObjects() {
    this._gameObjectObserver.getLastRemoved().forEach((gameObject) => {
      const gameObjectId = gameObject.getId();
      this._geometry[gameObjectId] = null;
    });
  }

  process() {
    const gl = this.gl as WebGLRenderingContext;

    const { canvas } = gl;

    this._resizeCanvas(canvas);

    // eslint-disable-next-line no-bitwise
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    this._processRemovedGameObjects();

    this._updateViewMatrix();
    this._allocateVertexData();

    if (!this._vertexData) {
      return;
    }

    this._gameObjectObserver.sort(this.sortFn);

    this._gameObjectObserver.forEach((gameObject, index) => {
      this._setUpVertexData(gameObject, index);
    });

    this._setUpBuffers();
    gl.drawArrays(
      gl.TRIANGLES, DRAW_OFFSET, DRAW_COUNT * this._gameObjectObserver.size(),
    );
  }
}

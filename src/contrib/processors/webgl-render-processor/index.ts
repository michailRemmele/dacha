import { GameObject, GameObjectObserver } from '../../../engine/gameObject';
import { Store } from '../../../engine/scene';
import { Renderable } from '../../components/renderable';
import { Transform } from '../../components/transform';
import { Camera } from '../../components/camera';

import { Rectangle } from './geometry/rectangle';
import { Color } from './color';
import { textureHandlers, TextureHandler, TextureDescriptor } from './texture-handlers';
import {
  ShaderBuilder,
  VERTEX_SHADER,
  FRAGMENT_SHADER,
  ShaderProvider,
} from './shader-builder';
import { MatrixTransformer } from './matrix-transformer';
import {
  composeSort,
  SortFn,
  createSortByLayer,
  sortByYAxis,
  sortByXAxis,
  sortByZAxis,
  sortByFit,
} from '../three-js-renderer/sort';
import { splitToBatch } from './utils';
import {
  MAX_COLOR_NUMBER,
  DRAW_OFFSET,
  DRAW_COUNT,
  STD_SCREEN_SIZE,
  VECTOR_2_SIZE,
  BYTES_PER_VECTOR_2,
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
  private shaderProvider: ShaderProvider;
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
  private _vertexData: Float32Array;
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

    this.shaderProvider = new ShaderProvider(gameObjectObserver);

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
      sortByFit,
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

    this._vertexData = new Float32Array(VERTEX_DATA_STRIDE);
  }

  processorDidMount() {
    window.addEventListener('resize', this._onWindowResizeBind);
    this._gameObjectObserver.subscribe('onremove', this.handleGameObjectRemove);
    this.gl = this._initGraphicContext();
    this._initExtensions();
    this._initScreen();
    this.program = this._initShaders();
    this._initProgramInfo();
    this.textures = this._initTextures();
  }

  processorWillUnmount() {
    window.removeEventListener('resize', this._onWindowResizeBind);
    this._gameObjectObserver.unsubscribe('onremove', this.handleGameObjectRemove);
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
  }

  private handleGameObjectRemove = (gameObject: GameObject) => {
    const gameObjectId = gameObject.getId();
    this._geometry[gameObjectId] = null;
  };

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
      uViewMatrix: this.gl.getUniformLocation(this.program, 'u_viewMatrix'),
      uTexAtlasSize: this.gl.getUniformLocation(this.program, 'u_texAtlasSize'),
      uModelViewMatrix: this.gl.getUniformLocation(this.program, 'u_modelViewMatrix'),
      uTexSize: this.gl.getUniformLocation(this.program, 'u_texSize'),
      uTexTranslate: this.gl.getUniformLocation(this.program, 'u_texTranslate'),
      uGameObjectSize: this.gl.getUniformLocation(this.program, 'u_gameObjectSize'),
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
      this._variables.aPosition as number,
      this._variables.aTexCoord as number,
    ];
    const stride = attrs.length * BYTES_PER_VECTOR_2;

    let offset = 0;
    for (let i = 0; i < attrs.length; i += 1) {
      this.gl.enableVertexAttribArray(attrs[i]);
      this.gl.vertexAttribPointer(
        attrs[i],
        VECTOR_2_SIZE,
        this.gl.FLOAT,
        false,
        stride,
        offset,
      );

      offset += BYTES_PER_VECTOR_2;
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

    matrixTransformer.translate(matrix, -renderable.width / 2, -renderable.height / 2);
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

  private resizeCanvas(canvas: HTMLCanvasElement) {
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

  private updateViewMatrix() {
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

  private setUpBuffers() {
    const vaoExt = this._vaoExt as OES_vertex_array_object;
    const gl = this.gl as WebGLRenderingContext;
    const vertexData = this._vertexData;

    vaoExt.bindVertexArrayOES(this._vao);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, vertexData);
  }

  private setUpVertexData(gameObject: GameObject) {
    const vertexData = this._vertexData;
    const gameObjectId = gameObject.getId();
    const renderable = gameObject.getComponent(RENDERABLE_COMPONENT_NAME) as Renderable;

    // TODO: Filter hidden object while frustum culling step and remove that
    if (renderable.disabled) {
      for (let i = 0; i < VERTEX_DATA_STRIDE; i += 1) {
        vertexData[i] = 0;
      }
      return;
    }

    const texture = this.textureAtlasDescriptor[renderable.src];
    const textureInfo = this.textureHandlers[renderable.type].handle(texture, renderable);

    const geometry = this._geometry[gameObjectId] || {
      position: new Rectangle(renderable.width, renderable.height).toArray(),
      texCoord: new Rectangle(textureInfo.width, textureInfo.height).toArray(),
    };
    this._geometry[gameObjectId] = geometry;

    const { position, texCoord } = geometry;

    for (let i = 0, j = 0; i < position.length; i += 2, j += VERTEX_STRIDE) {
      vertexData[j] = position[i];
      vertexData[j + 1] = position[i + 1];
      vertexData[j + 2] = texCoord[i];
      vertexData[j + 3] = texCoord[i + 1];
    }
  }

  private setUpUniforms(gameObject: GameObject) {
    const gl = this.gl as WebGLRenderingContext;

    const renderable = gameObject.getComponent(RENDERABLE_COMPONENT_NAME) as Renderable;
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

    gl.uniformMatrix3fv(
      this._variables.uModelViewMatrix,
      false,
      modelViewMatrix,
    );
    gl.uniform2fv(this._variables.uTexSize, [textureInfo.width, textureInfo.height]);
    gl.uniform2fv(this._variables.uTexTranslate, [textureInfo.x, textureInfo.y]);
    gl.uniform2fv(this._variables.uGameObjectSize, [renderable.width, renderable.height]);
  }

  process() {
    this._gameObjectObserver.fireEvents();

    const gl = this.gl as WebGLRenderingContext;

    const { canvas } = gl;

    this.resizeCanvas(canvas);

    // eslint-disable-next-line no-bitwise
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    this.updateViewMatrix();

    this._gameObjectObserver.sort(this.sortFn);

    const batches = splitToBatch(
      this._gameObjectObserver.getList(), this.shaderProvider,
    );

    batches.forEach((batch) => {
      batch.forEach((gameObject) => {
        this.setUpUniforms(gameObject);
        this.setUpVertexData(gameObject);
        this.setUpBuffers();
        gl.drawArrays(gl.TRIANGLES, DRAW_OFFSET, DRAW_COUNT);
      });
    });
  }
}

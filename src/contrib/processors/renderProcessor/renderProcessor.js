import Processor from 'engine/processor/processor';

import Rectangle from './geometry/shapes/rectangle';
import Color from './color/color';
import textureHandlers from './textureHandlers';
import ShaderBuilder from './shaderBuilder/shaderBuilder';
import MatrixTransformer from './matrixTransformer/matrixTransformer';

const MAX_COLOR_NUMBER = 255;
const DRAW_OFFSET = 0;
const DRAW_COUNT = 6;
const STD_SCREEN_SIZE = 1080;

const VECTOR_2_SIZE = 2;
const BYTES_PER_VECTOR_2 = Float32Array.BYTES_PER_ELEMENT * VECTOR_2_SIZE;
const MATRIX_ROW_SIZE = 3;
const MATRIX_COLUMN_SIZE = 3;
const MATRIX_SIZE = MATRIX_ROW_SIZE * MATRIX_COLUMN_SIZE;
const BYTES_PER_MATRIX = Float32Array.BYTES_PER_ELEMENT * MATRIX_ROW_SIZE * MATRIX_COLUMN_SIZE;
const BYTES_PER_MATRIX_ROW = Float32Array.BYTES_PER_ELEMENT * MATRIX_ROW_SIZE;

const VERTEX_DATA_STRIDE = ((VECTOR_2_SIZE * 2) + (MATRIX_SIZE * 2)) * DRAW_COUNT;

const RENDERABLE_COMPONENT_NAME = 'renderable';
const TRANSFORM_COMPONENT_NAME = 'transform';
const CAMERA_COMPONENT_NAME = 'camera';
const CURRENT_CAMERA_NAME = 'currentCamera';

class RenderProcessor extends Processor {
  constructor(options) {
    super();

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
    this.textureHandlers = Object.keys(textureHandlers).reduce((storage, key) => {
      const TextureHandler = textureHandlers[key];
      storage[key] = new TextureHandler();
      return storage;
    }, {});

    this._matrixTransformer = new MatrixTransformer();

    this._backgroundColor = new Color(backgroundColor);

    this._window = window;
    this._windowWidth;
    this._windowHeight;

    this._shaders = [];

    this._sortingLayer = sortingLayers.reduce((storage, layer, index) => {
      storage[layer] = index;
      return storage;
    }, {});
    this._store = store;
    this._gameObjectObserver = gameObjectObserver;

    this._canvasWidth;
    this._canvasHeight;
    this._scaleSensitivity = Math.min(Math.max(scaleSensitivity, 0), 100) / 100;
    this._screenScale = 1;

    this._vaoExt = null;

    this._buffer = null;
    this._vao = null;

    this._textureMatrixCache = {};
    this._viewMatrixStats = {};

    this._vertexData = null;
    this._gameObjectsCount = 0;
  }

  processorDidMount() {
    this.gl = this._initGraphicContext();
    this._initExtensions();
    this._initScreen();
    this.program = this._initShaders();
    this._initProgramInfo();
    this.textures = this._initTextures();
  }

  processorWillUnmount() {
    this._shaders.forEach((shader) => {
      this.gl.detachShader(this.program, shader);
      this.gl.deleteShader(shader);
    });
    this.gl.deleteProgram(this.program);
    this.gl.deleteTexture(this.textures);

    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this._buffer = null;
    this._shaders = [];
    this.program = null;
    this.textures = null;
    this.gl = null;
  }

  _initGraphicContext() {
    let graphicContext = null;

    try {
      graphicContext =
        this._window.getContext('webgl') || this._window.getContext('experimental-webgl');
    } catch (e) {
      throw new Error('Unable to get graphic context.');
    }

    if (!graphicContext) {
      throw new Error('Unable to initialize WebGL. Your browser may not support it.');
    }

    return graphicContext;
  }

  _initExtensions() {
    this._vaoExt = this.gl.getExtension('OES_vertex_array_object');

    if (!this._vaoExt) {
      return alert('Unable to initialize OES_vertex_array_object extension');
    }
  }

  _initScreen() {
    this.gl.clearColor(
      this._backgroundColor.red() / MAX_COLOR_NUMBER,
      this._backgroundColor.green() / MAX_COLOR_NUMBER,
      this._backgroundColor.blue() / MAX_COLOR_NUMBER,
      1.0
    );
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
    this.gl.depthFunc(this.gl.LEQUAL);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }

  _initShaders() {
    const shaderBuilder = new ShaderBuilder(this.gl);

    const vertexShader = shaderBuilder.create(shaderBuilder.VERTEX_SHADER);
    const fragmentShader = shaderBuilder.create(shaderBuilder.FRAGMENT_SHADER);

    const shaderProgram = this.gl.createProgram();
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
    this.gl.useProgram(this.program);

    this._variables = {
      aPosition: this.gl.getAttribLocation(this.program, 'a_position'),
      aTexCoord: this.gl.getAttribLocation(this.program, 'a_texCoord'),
      aModelViewMatrix: this.gl.getAttribLocation(this.program, 'a_modelViewMatrix'),
      aTexMatrix: this.gl.getAttribLocation(this.program, 'a_texMatrix'),
      uViewMatrix: this.gl.getUniformLocation(this.program, 'u_viewMatrix'),
    };

    this._buffer = this.gl.createBuffer();
    this._vao = this._createVAO();
  }

  _createVAO() {
    const vao = this._vaoExt.createVertexArrayOES();
    this._vaoExt.bindVertexArrayOES(vao);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this._buffer);

    const attrs = [
      {
        loc: this._variables.aPosition,
        type: 'vec2',
      },
      {
        loc: this._variables.aTexCoord,
        type: 'vec2',
      },
      {
        loc: this._variables.aModelViewMatrix,
        type: 'mat3',
      },
      {
        loc: this._variables.aTexMatrix,
        type: 'mat3',
      },
    ];
    const sizeMap = {
      mat3: BYTES_PER_MATRIX,
      vec2: BYTES_PER_VECTOR_2,
    };
    const stride = attrs.reduce((totalSize, attr) => (
      totalSize + sizeMap[attr.type]
    ), 0);

    let offset = 0;
    for (let i = 0; i < attrs.length; i++) {
      if (attrs[i].type === 'vec2') {
        this.gl.enableVertexAttribArray(attrs[i].loc);
        this.gl.vertexAttribPointer(
          attrs[i].loc,
          VECTOR_2_SIZE,
          this.gl.FLOAT,
          false,
          stride,
          offset
        );

        offset += BYTES_PER_VECTOR_2;
      } else if (attrs[i].type === 'mat3') {
        for (let j = 0; j < MATRIX_ROW_SIZE; j++) {
          const loc = attrs[i].loc + j;

          this.gl.enableVertexAttribArray(loc);
          this.gl.vertexAttribPointer(
            loc,
            MATRIX_ROW_SIZE,
            this.gl.FLOAT,
            false,
            stride,
            offset + (j * BYTES_PER_MATRIX_ROW)
          );
        }

        offset += BYTES_PER_MATRIX;
      }
    }

    this._vaoExt.bindVertexArrayOES(null);

    return vao;
  }

  _initTextures() {
    const texture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);

    this.gl.texImage2D(
      this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.textureAtlas
    );

    return texture;
  }

  _getModelViewMatrix(renderable, x, y, rotation) {
    const matrixTransformer = this._matrixTransformer;

    const matrix = matrixTransformer.getIdentityMatrix();

    matrixTransformer.translate(matrix, renderable.origin[0], renderable.origin[1]);
    renderable.flipX && matrixTransformer.flipX(matrix);
    renderable.flipY && matrixTransformer.flipY(matrix);
    matrixTransformer.rotate(matrix, (renderable.rotation + rotation) % 360);
    matrixTransformer.translate(matrix, x, y);

    return matrix;
  }

  _isTextureChanged(textureInfo, newTextureInfo) {
    return textureInfo.width !== newTextureInfo.width ||
      textureInfo.height !== newTextureInfo.height ||
      textureInfo.x !== newTextureInfo.x ||
      textureInfo.y !== newTextureInfo.y;
  }

  _getTextureMatrix(textureInfo, gameObjectId) {
    const { width, height, x, y } = textureInfo;
    const cache = this._textureMatrixCache[gameObjectId];

    if (cache && !this._isTextureChanged(cache.textureInfo, textureInfo)) {
      return cache.matrix;
    }

    const matrixTransformer = this._matrixTransformer;
    const projectX = 1 / this.textureAtlasSize.width;
    const projectY = 1 / this.textureAtlasSize.height;

    const matrix = matrixTransformer.getIdentityMatrix();

    matrixTransformer.scale(matrix, width, height);
    matrixTransformer.translate(matrix, x, y);
    matrixTransformer.scale(matrix, projectX, projectY);

    this._textureMatrixCache[gameObjectId] = {
      matrix,
      textureInfo,
    };

    return matrix;
  }

  _getCompareFunction() {
    return (a, b) => {
      const aRenderable = a.getComponent(RENDERABLE_COMPONENT_NAME);
      const bRenderable = b.getComponent(RENDERABLE_COMPONENT_NAME);
      const aSortingLayerOrder = this._sortingLayer[aRenderable.sortingLayer];
      const bSortingLayerOrder = this._sortingLayer[bRenderable.sortingLayer];
      const { height: aHeight, width: aWidth } = aRenderable;
      const { height: bHeight, width: bWidth } = bRenderable;

      if (aSortingLayerOrder > bSortingLayerOrder) {
        return 1;
      }

      if (aSortingLayerOrder < bSortingLayerOrder) {
        return -1;
      }

      const aTransform = a.getComponent(TRANSFORM_COMPONENT_NAME);
      const bTransform = b.getComponent(TRANSFORM_COMPONENT_NAME);

      const aOffsetY = aTransform.offsetY + (aHeight / 2);
      const aOffsetX = aTransform.offsetX + (aWidth / 2);
      const bOffsetY = bTransform.offsetY + (bHeight / 2);
      const bOffsetX = bTransform.offsetX + (bWidth / 2);

      if (aOffsetY > bOffsetY) {
        return 1;
      }

      if (aOffsetY < bOffsetY) {
        return -1;
      }

      if (aOffsetX > bOffsetX) {
        return 1;
      }

      if (aOffsetX < bOffsetX) {
        return -1;
      }

      return 0;
    };
  }

  _shouldVAOUpdate(gameObject) {
    const gameObjectId = gameObject.getId();

    if (!this._vaoCache[gameObjectId]) {
      return true;
    }

    const previousRenderable = this._vaoCache[gameObjectId].renderable;
    const renderable = gameObject.getComponent(RENDERABLE_COMPONENT_NAME);

    return renderable.width !== previousRenderable.width
      || renderable.height !== previousRenderable.height;
  }

  _setVertexInfo(renderable, textureInfo, modelViewMatrix, textureMatrix, index) {
    const position = new Rectangle(renderable.width, renderable.height).toArray();
    const texCoord = new Rectangle(
      renderable.width / textureInfo.width,
      renderable.height / textureInfo.height
    ).toArray();

    let offset = index * VERTEX_DATA_STRIDE;

    for (let i = 0; i < position.length; i += 2) {
      this._vertexData[offset] = position[i];
      this._vertexData[offset + 1] = position[i + 1];
      this._vertexData[offset + 2] = texCoord[i];
      this._vertexData[offset + 3] = texCoord[i + 1];

      offset += VECTOR_2_SIZE * 2;

      for (let k = 0; k < MATRIX_SIZE; k++) {
        this._vertexData[offset + k] = modelViewMatrix[k];
      }

      offset += MATRIX_SIZE;

      for (let k = 0; k < MATRIX_SIZE; k++) {
        this._vertexData[offset + k] = textureMatrix[k];
      }

      offset += MATRIX_SIZE;
    }
  }

  _resizeCanvas(canvas) {
    const devicePixelRatio = window.devicePixelRatio || 1;

    this._windowWidth = this._window.clientWidth;
    this._windowHeight = this._window.clientHeight;

    const canvasWidth = this._windowWidth * devicePixelRatio;
    const canvasHeight = this._windowHeight * devicePixelRatio;

    if (canvasWidth === this._canvasWidth && canvasHeight === this._canvasHeight) {
      return;
    }

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const screenSize = Math.sqrt(
      Math.pow(canvas.clientWidth, 2) + Math.pow(canvas.clientHeight, 2)
    );
    const avaragingValue = 1 - this._scaleSensitivity;
    const normalizedSize = screenSize - ((screenSize - STD_SCREEN_SIZE) * avaragingValue);

    this._screenScale = normalizedSize / STD_SCREEN_SIZE;
    this._canvasWidth = canvasWidth;
    this._canvasHeight = canvasHeight;

    this.gl.viewport(0, 0, this._canvasWidth, this._canvasHeight);
  }

  _updateViewMatrix() {
    const currentCamera = this._store.get(CURRENT_CAMERA_NAME);
    const transform = currentCamera.getComponent(TRANSFORM_COMPONENT_NAME);
    const { zoom } = currentCamera.getComponent(CAMERA_COMPONENT_NAME);
    const scale =  zoom * this._screenScale;

    const prevStats = this._viewMatrixStats;

    if (
      prevStats.x === transform.offsetX &&
      prevStats.y === transform.offsetY &&
      prevStats.width === this._windowWidth &&
      prevStats.height === this._windowHeight &&
      prevStats.scale === scale
    ) {
      return;
    }

    const matrixTransformer = this._matrixTransformer;
    const viewMatrix = matrixTransformer.getIdentityMatrix();
    matrixTransformer.translate(viewMatrix, -transform.offsetX, -transform.offsetY);
    matrixTransformer.scale(viewMatrix, scale, scale);
    matrixTransformer.project(viewMatrix, this._windowWidth, this._windowHeight);

    this.gl.uniformMatrix3fv(
      this._variables.uViewMatrix,
      false,
      viewMatrix
    );

    this._viewMatrixStats.width = this._windowWidth;
    this._viewMatrixStats.height = this._windowHeight;
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
    this._vaoExt.bindVertexArrayOES(this._vao);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, this._vertexData, this.gl.STATIC_DRAW);
  }

  _processRemovedGameObjects() {
    this._gameObjectObserver.getLastRemoved().forEach((gameObject) => {
      const gameObjectId = gameObject.getId();
      this._textureMatrixCache[gameObjectId] = null;
    });
  }

  process() {
    const canvas = this.gl.canvas;

    this._resizeCanvas(canvas);

    // this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this._gameObjectObserver.sort(this._getCompareFunction());

    this._updateViewMatrix();

    this._processRemovedGameObjects();

    this._allocateVertexData();

    this._gameObjectObserver.forEach((gameObject, index) => {
      const renderable = gameObject.getComponent(RENDERABLE_COMPONENT_NAME);
      const transform = gameObject.getComponent(TRANSFORM_COMPONENT_NAME);
      const texture = this.textureAtlasDescriptor[renderable.src];
      const textureInfo = this.textureHandlers[renderable.type].handle(texture, renderable);

      const modelViewMatrix = this._getModelViewMatrix(
        renderable,
        transform.offsetX,
        transform.offsetY,
        transform.rotation
      );
      const textureMatrix = this._getTextureMatrix(
        textureInfo,
        gameObject.getId()
      );

      this._setVertexInfo(
        renderable, textureInfo, modelViewMatrix, textureMatrix, index
      );
    });

    this._setUpBuffers();
    this.gl.drawArrays(
      this.gl.TRIANGLES, DRAW_OFFSET, DRAW_COUNT * this._gameObjectObserver.size()
    );
  }
}

export default RenderProcessor;

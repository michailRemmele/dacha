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
const BYTES_PER_MATRIX = Float32Array.BYTES_PER_ELEMENT * MATRIX_ROW_SIZE * MATRIX_COLUMN_SIZE;
const BYTES_PER_MATRIX_ROW = Float32Array.BYTES_PER_ELEMENT * MATRIX_ROW_SIZE;

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

    this._ext = null;

    this._buffer = null;
    this._matrixBuffer = null;

    this._lastInstance = null;
  }

  processorDidMount() {
    this.gl = this._initGraphicContext();
    this._initExtensions();
    this._initScreen();
    this.program = this._initShaders();
    this._initProgramInfo();
    this.textures = this._initTextures();
    this._setUpGlobalUniforms();
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
    this._matrixBuffer = null;
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
    this._ext = this.gl.getExtension('ANGLE_instanced_arrays');

    if (!this._ext) {
      return alert('Unable to initialize extensions. Need ANGLE_instanced_arrays');
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
      aMatrix: this.gl.getAttribLocation(this.program, 'a_matrix'),
      aTexMatrix: this.gl.getAttribLocation(this.program, 'a_texMatrix'),
    };

    this._buffer = this.gl.createBuffer();
    this._matrixBuffer = this.gl.createBuffer();
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

  _getTransformationMatrix(props) {
    const matrixTransformer = this._matrixTransformer;
    const { renderable, x, y, rotation } = props;

    const currentCamera = this._store.get(CURRENT_CAMERA_NAME);
    const cameraTransform = currentCamera.getComponent(TRANSFORM_COMPONENT_NAME);
    const { zoom } = currentCamera.getComponent(CAMERA_COMPONENT_NAME);

    const scale =  zoom * this._screenScale;

    const matrix = matrixTransformer.getIdentityMatrix();

    matrixTransformer.translate(matrix, renderable.origin[0], renderable.origin[1]);
    renderable.flipX && matrixTransformer.flipX(matrix);
    renderable.flipY && matrixTransformer.flipY(matrix);
    matrixTransformer.rotate(matrix, (renderable.rotation + rotation) % 360);
    matrixTransformer.translate(matrix, x - cameraTransform.offsetX, y - cameraTransform.offsetY);
    matrixTransformer.scale(matrix, scale, scale);
    matrixTransformer.project(matrix, this._windowWidth, this._windowHeight);

    return matrix;
  }

  _getTextureMatrix(textureInfo) {
    const { width, height, x, y } = textureInfo;
    const matrixTransformer = this._matrixTransformer;
    const projectX = 1 / this.textureAtlasSize.width;
    const projectY = 1 / this.textureAtlasSize.height;

    const matrix = matrixTransformer.getIdentityMatrix();

    matrixTransformer.scale(matrix, width, height);
    matrixTransformer.translate(matrix, x, y);
    matrixTransformer.scale(matrix, projectX, projectY);

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

  _checkOnGeometryChange(gameObject) {
    const gameObjectId = gameObject.getId();

    if (!this._gameObjectCashMap[gameObjectId]) {
      return true;
    }

    const previousRenderable = this._gameObjectCashMap[gameObjectId].renderable;
    const renderable = gameObject.getComponent(RENDERABLE_COMPONENT_NAME);

    return renderable.width !== previousRenderable.width
      || renderable.height !== previousRenderable.height;
  }

  _isAnotherInstance(gameObject) {
    if (!this._lastInstance) {
      this._lastInstance = gameObject;
      return false;
    }

    const lastRenderable = this._lastInstance.getComponent(RENDERABLE_COMPONENT_NAME);
    const renderable = gameObject.getComponent(RENDERABLE_COMPONENT_NAME);

    this._lastInstance = gameObject;

    return lastRenderable.src !== renderable.src
      || lastRenderable.type !== renderable.type
      || lastRenderable.width !== renderable.width
      || lastRenderable.height !== renderable.height;
  }

  _createVertexInfo(renderable, textureInfo) {
    const position = new Rectangle(renderable.width, renderable.height).toArray();
    const texCoord = new Rectangle(
      renderable.width / textureInfo.width,
      renderable.height / textureInfo.height
    ).toArray();
    const totalLength = position.length + texCoord.length;

    const vertices = new Float32Array(totalLength);

    for (let i = 0, j = 0; i < position.length, j < totalLength; i += 2, j += 4) {
      vertices[j] = position[i];
      vertices[j + 1] = position[i + 1];
      vertices[j + 2] = texCoord[i];
      vertices[j + 3] = texCoord[i + 1];
    }

    return vertices;
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
  }

  _setUpGlobalUniforms() {
    // this.gl.uniform2fv(
    //   this._variables.uTextureAtlasSize,
    //   [ this.textureAtlasSize.width, this.textureAtlasSize.height ]
    // );
  }

  _setUpBuffers(vertexData, matrixData) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this._buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, vertexData, this.gl.STATIC_DRAW);

    const vec2Attributes = [ this._variables.aPosition, this._variables.aTexCoord ];

    for (let i = 0; i < vec2Attributes.length; i++) {
      this.gl.enableVertexAttribArray(vec2Attributes[i]);
      this.gl.vertexAttribPointer(
        vec2Attributes[i],
        VECTOR_2_SIZE,
        this.gl.FLOAT,
        false,
        BYTES_PER_VECTOR_2 * vec2Attributes.length,
        i * BYTES_PER_VECTOR_2
      );
    }

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this._matrixBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(matrixData), this.gl.STATIC_DRAW);

    const instancedAttrs = {
      mat3: [ this._variables.aMatrix, this._variables.aTexMatrix ],
    };
    const sizeMap = {
      mat3: BYTES_PER_MATRIX,
      vec2: BYTES_PER_VECTOR_2,
    };
    const stride = Object.keys(instancedAttrs).reduce((totalSize, key) => (
      totalSize + (sizeMap[key] * instancedAttrs[key].length)
    ), 0);

    for (let i = 0; i < instancedAttrs.mat3.length; i++) {
      for (let j = 0; j < MATRIX_ROW_SIZE; j++) {
        const loc = instancedAttrs.mat3[i] + j;

        this.gl.enableVertexAttribArray(loc);
        this.gl.vertexAttribPointer(
          loc,
          MATRIX_ROW_SIZE,
          this.gl.FLOAT,
          false,
          stride,
          (i * BYTES_PER_MATRIX) + (j * BYTES_PER_MATRIX_ROW)
        );
        this._ext.vertexAttribDivisorANGLE(loc, 1);
      }
    }
  }

  _drawInstanced(vertexData, matrixData, count) {
    this._setUpBuffers(vertexData, matrixData);

    this._ext.drawArraysInstancedANGLE(
      this.gl.TRIANGLES,
      DRAW_OFFSET,
      DRAW_COUNT,
      count
    );
  }

  process() {
    const canvas = this.gl.canvas;

    this._resizeCanvas(canvas);
    this.gl.viewport(0, 0, canvas.width, canvas.height);

    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this._gameObjectObserver.sort(this._getCompareFunction());

    let vertexData = null;
    let matrixData = [];
    let count = 0;
    const size = this._gameObjectObserver.size();

    this._lastInstance = null;

    this._gameObjectObserver.forEach((gameObject, index) => {
      const renderable = gameObject.getComponent(RENDERABLE_COMPONENT_NAME);
      const transform = gameObject.getComponent(TRANSFORM_COMPONENT_NAME);
      const texture = this.textureAtlasDescriptor[renderable.src];
      const textureInfo = this.textureHandlers[renderable.type].handle(texture, renderable);

      if (index === 0) {
        vertexData = this._createVertexInfo(renderable, textureInfo);
      }

      if (this._isAnotherInstance(gameObject)) {
        this._drawInstanced(vertexData, matrixData, count);
        vertexData = this._createVertexInfo(renderable, textureInfo);
        matrixData = [];
        count = 0;
      }

      Array.prototype.push.apply(matrixData, this._getTransformationMatrix({
        renderable: renderable,
        x: transform.offsetX,
        y: transform.offsetY,
        rotation: transform.rotation,
      }));
      Array.prototype.push.apply(matrixData, this._getTextureMatrix(
        textureInfo
      ));
      count += 1;

      if (index === size - 1) {
        this._drawInstanced(vertexData, matrixData, count);
      }
    });
  }
}

export default RenderProcessor;

import Processor from 'engine/processor/processor';

import Rectangle from './geometry/shapes/rectangle';
import Color from './color/color';
import textureHandlers from './textureHandlers';
import ShaderBuilder from './shaderBuilder/shaderBuilder';
import MatrixTransformer from './matrixTransformer/matrixTransformer';
import webglUtils from './vendor/webglUtils';

const MAX_COLOR_NUMBER = 255;
const RENDER_COMPONENTS_NUMBER = 2;
const DRAW_OFFSET = 0;
const DRAW_COUNT = 6;

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
      store,
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

    this.canvas = window;

    this._shaders = [];

    this._sortingLayer = sortingLayers.reduce((storage, layer, index) => {
      storage[layer] = index;
      return storage;
    }, {});
    this._store = store;
    this._gameObjectObserver = gameObjectObserver;

    this._gameObjectCashMap = {};
  }

  processorDidMount() {
    this.gl = this._initGraphicContext();
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

    this._shaders = [];
    this.program = null;
    this.textures = null;
    this.gl = null;
  }

  _initGraphicContext() {
    let graphicContext = null;

    try {
      graphicContext =
        this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
    } catch (e) {
      throw new Error('Unable to get graphic context.');
    }

    if (!graphicContext) {
      throw new Error('Unable to initialize WebGL. Your browser may not support it.');
    }

    return graphicContext;
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

    this.programInfo = {
      attribs: {
        setters: webglUtils.createAttributeSetters(this.gl, this.program),
      },
      uniforms: {
        setters: webglUtils.createUniformSetters(this.gl, this.program),
      },
    };
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
    const canvas = this.gl.canvas;
    const matrixTransformer = this._matrixTransformer;
    const { renderable, x, y, rotation } = props;

    const currentCamera = this._store.get(CURRENT_CAMERA_NAME);
    const { zoom: cameraZoom } = currentCamera.getComponent(CAMERA_COMPONENT_NAME);
    const cameraTransform = currentCamera.getComponent(TRANSFORM_COMPONENT_NAME);

    const matrix = matrixTransformer.getIdentityMatrix();

    matrixTransformer.translate(matrix, renderable.origin[0], renderable.origin[1]);
    renderable.flipX && matrixTransformer.flipX(matrix);
    renderable.flipY && matrixTransformer.flipY(matrix);
    matrixTransformer.rotate(matrix, (renderable.rotation + rotation) % 360);
    matrixTransformer.translate(matrix, x - cameraTransform.offsetX, y - cameraTransform.offsetY);
    matrixTransformer.scale(matrix, cameraZoom, cameraZoom);
    matrixTransformer.project(matrix, canvas.clientWidth, canvas.clientHeight);

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

  _createBufferInfo(renderable, textureInfo) {
    const attribs = {
      position: {
        data: new Rectangle(renderable.width, renderable.height).toArray(),
        numComponents: RENDER_COMPONENTS_NUMBER,
      },
      texCoord: {
        data: new Rectangle(textureInfo.width, textureInfo.height).toArray(),
        numComponents: RENDER_COMPONENTS_NUMBER,
      },
    };

    return webglUtils.createBufferInfoFromArrays(this.gl, attribs);
  }

  process() {
    this._gameObjectObserver.getLastRemoved().forEach((gameObject) => {
      const gameObjectId = gameObject.getId();
      this._gameObjectCashMap[gameObjectId] = null;
    });

    const canvas = this.gl.canvas;

    webglUtils.resizeCanvasToDisplaySize(this.canvas, window.devicePixelRatio);
    this.gl.viewport(0, 0, canvas.width, canvas.height);

    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this._gameObjectObserver.sort(this._getCompareFunction());
    this._gameObjectObserver.forEach((gameObject) => {
      const gameObjectId = gameObject.getId();

      const renderable = gameObject.getComponent(RENDERABLE_COMPONENT_NAME);
      const transform = gameObject.getComponent(TRANSFORM_COMPONENT_NAME);
      const texture = this.textureAtlasDescriptor[renderable.src];
      const textureInfo = this.textureHandlers[renderable.type].handle(texture, renderable);

      if (this._checkOnGeometryChange(gameObject)) {
        this._gameObjectCashMap[gameObjectId] = {
          renderable: renderable.clone(),
          bufferInfo: this._createBufferInfo(renderable, textureInfo),
        };
      }

      webglUtils.setBuffersAndAttributes(
        this.gl,
        this.programInfo.attribs.setters,
        this._gameObjectCashMap[gameObjectId].bufferInfo
      );

      const uniforms = {
        u_matrix: this._getTransformationMatrix({
          renderable: renderable,
          x: transform.offsetX,
          y: transform.offsetY,
          rotation: transform.rotation,
        }),
        u_textureAtlasSize: [ this.textureAtlasSize.width, this.textureAtlasSize.height ],
        u_texCoordTranslation: [ textureInfo.x, textureInfo.y ],
        u_quadSize: [ renderable.width, renderable.height ],
        u_textureSize: [ textureInfo.width, textureInfo.height ],
      };
      webglUtils.setUniforms(this.programInfo.uniforms.setters, uniforms);

      this.gl.drawArrays(this.gl.TRIANGLES, DRAW_OFFSET, DRAW_COUNT);
    });
  }
}

export default RenderProcessor;

import Processor from 'engine/processor/processor';

import Rectangle from './geometry/shapes/rectangle';
import Color from './color/color';
import textureHandlers from './textureHandlers';
import ShaderBuilder from './shaderBuilder/shaderBuilder';
import MatrixTransformer from './matrixTransformer/matrixTransformer';
import webglUtils from './vendor/webglUtils';

const MAX_COLOR_NUMBER = 255;
const RENDER_COMPONENTS_NUMBER = 2;
const RENDER_SCALE = 2;
const DRAW_OFFSET = 0;
const DRAW_COUNT = 6;

const RENDERABLE_COMPONENT_NAME = 'renderable';
const TRANSFORM_COMPONENT_NAME = 'transform';

class RenderProcessor extends Processor {
  constructor(options) {
    super();

    const {
      window, textureAtlas,
      textureAtlasDescriptor,
      backgroundColor, scene, gameObjectObserver,
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

    this.shaders = [];

    this._scene = scene;
    this._gameObjectObserver = gameObjectObserver;
  }

  processorDidMount() {
    this.gl = this._initGraphicContext();
    this._initScreen();
    this.program = this._initShaders();
    this._initProgramInfo();
    this.textures = this._initTextures();
  }

  processorWillUnmount() {
    this.shaders.forEach((shader) => {
      this.gl.detachShader(this.program, shader);
      this.gl.deleteShader(shader);
    });
    this.gl.deleteProgram(this.program);
    this.gl.deleteTexture(this.textures);

    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this.shaders = [];
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

    this.shaders.push(vertexShader, fragmentShader);

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
    const { renderable, x, y } = props;

    const matrix = [
      1, 0, 0,
      0, 1, 0,
      0, 0, 1,
    ];

    matrixTransformer.translate(matrix, renderable.origin[0], renderable.origin[1]);
    renderable.flipX && matrixTransformer.flipX(matrix);
    renderable.flipY && matrixTransformer.flipY(matrix);
    matrixTransformer.rotate(matrix, renderable.rotation);
    matrixTransformer.translate(matrix, x, y);
    matrixTransformer.scale(matrix, RENDER_SCALE, RENDER_SCALE);
    matrixTransformer.project(matrix, canvas.clientWidth, canvas.clientHeight);

    return matrix;
  }

  _getCompareFunction() {
    const sortingLayerOrder = this._scene.getSortingLayers().reduce((storage, layer, index) => {
      storage[layer] = index;

      return storage;
    }, {});

    return (a, b) => {
      const aSortingLayerOrder = sortingLayerOrder[a.getSortingLayer()];
      const bSortingLayerOrder = sortingLayerOrder[b.getSortingLayer()];

      if (aSortingLayerOrder > bSortingLayerOrder) {
        return 1;
      }

      if (aSortingLayerOrder < bSortingLayerOrder) {
        return -1;
      }

      const aTransform = a.getComponent(TRANSFORM_COMPONENT_NAME);
      const bTransform = b.getComponent(TRANSFORM_COMPONENT_NAME);

      if (aTransform.offsetY > bTransform.offsetY) {
        return 1;
      }

      if (aTransform.offsetY < bTransform.offsetY) {
        return -1;
      }

      if (aTransform.offsetX > bTransform.offsetX) {
        return 1;
      }

      if (aTransform.offsetX < bTransform.offsetX) {
        return -1;
      }

      return 0;
    };
  }

  process() {
    const canvas = this.gl.canvas;

    webglUtils.resizeCanvasToDisplaySize(this.canvas, window.devicePixelRatio);
    this.gl.viewport(0, 0, canvas.width, canvas.height);

    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    this._gameObjectObserver.sort(this._getCompareFunction());
    this._gameObjectObserver.forEach((gameObject) => {
      const renderable = gameObject.getComponent(RENDERABLE_COMPONENT_NAME);
      const transform = gameObject.getComponent(TRANSFORM_COMPONENT_NAME);
      const texture = this.textureAtlasDescriptor[renderable.src];
      const textureInfo = this.textureHandlers[renderable.type].handle(texture, renderable);

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
      const bufferInfo = webglUtils.createBufferInfoFromArrays(this.gl, attribs);

      webglUtils.setBuffersAndAttributes(this.gl, this.programInfo.attribs.setters, bufferInfo);

      const uniforms = {
        u_matrix: this._getTransformationMatrix({
          renderable: renderable,
          x: transform.offsetX,
          y: transform.offsetY,
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

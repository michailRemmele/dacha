import IOC from 'core/ioc/ioc';
import * as global from 'consts/global';

import ShaderBuilder from './shaderBuilder/shaderBuilder';
import webglUtils from 'vendor/webgl-utils';

const RENDERABLE_COMPONENT_KEY_NAME = 'renderable';
const RENDER_COMPONENTS_NUMBER = 2;
const RENDER_SCALE = 5;
const DRAW_OFFSET = 0;
const DRAW_COUNT = 6;

class WebGlRenderProcessor {
  constructor(resources) {
    this.textureAtlas = resources.textureAtlas;
    this.textureAtlasSize = {
      width: this.textureAtlas.width,
      height: this.textureAtlas.height,
    };
    this.textureAtlasMap = resources.textureAtlasMap;

    this.canvas = IOC.resolve(global.WINDOW_KEY_NAME);

    this.gl = this._initGraphicContext();
    this._initScreen();
    this.program = this._initShaders();
    this._initGraphics();
  }

  _initGraphicContext() {
    let graphicContext = null;

    try {
      graphicContext =
        this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
    } catch (e) {
      console.log('Unable to get graphic context.');
    }

    if (!graphicContext) {
      console.log('Unable to initialize WebGL. Your browser may not support it.');
    }

    return graphicContext;
  }

  _initScreen() {
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.enable(this.gl.DEPTH_TEST);
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
      console.log('Unable to initialize the shader program.');
    }

    return shaderProgram;
  }

  _initGraphics() {
    this.gl.useProgram(this.program);

    const uniformSetters = webglUtils.createUniformSetters(this.gl, this.program);
    const attribSetters = webglUtils.createAttributeSetters(this.gl, this.program);

    const texture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);

    this.gl.texImage2D(
      this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.textureAtlas
    );

    this.programInfo = {
      attribs: {
        setters: attribSetters,
      },
      uniforms: {
        setters: uniformSetters,
      },
    };
  }

  _getRectangle(x, y, width, height) {
    const x1 = x;
    const x2 = x + width;
    const y1 = y;
    const y2 = y + height;
    return [
      x1, y1,
      x2, y1,
      x1, y2,
      x1, y2,
      x2, y1,
      x2, y2,
    ];
  }

  process() {
    const sceneProvider = IOC.resolve(global.SCENE_PROVIDER_KEY_NAME);
    const currentScene = sceneProvider.getCurrentScene();

    webglUtils.resizeCanvasToDisplaySize(this.canvas, window.devicePixelRatio);
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

    const attribsInfo = this.programInfo.attribs;
    const uniformsInfo = this.programInfo.uniforms;

    currentScene.forEachPlacedGameObject((gameObject, x, y) => {
      const renderable = gameObject.getComponent(RENDERABLE_COMPONENT_KEY_NAME);
      const texture = this.textureAtlasMap[renderable.src];

      const attribs = {
        position: {
          data: this._getRectangle(x, y, renderable.width, renderable.height),
          numComponents: RENDER_COMPONENTS_NUMBER,
        },
        texCoord: {
          data: this._getRectangle(texture.x, texture.y, texture.width, texture.height),
          numComponents: RENDER_COMPONENTS_NUMBER,
        },
      };
      const bufferInfo = webglUtils.createBufferInfoFromArrays(this.gl, attribs);

      webglUtils.setBuffersAndAttributes(this.gl, attribsInfo.setters, bufferInfo);

      const uniforms = {
        u_resolution: [ this.gl.canvas.width, this.gl.canvas.height ],
        u_scale: [ RENDER_SCALE, RENDER_SCALE ],
        u_textureAtlasSize: [ this.textureAtlasSize.width, this.textureAtlasSize.height ],
      };
      webglUtils.setUniforms(uniformsInfo.setters, uniforms);

      this.gl.drawArrays(this.gl.TRIANGLES, DRAW_OFFSET, DRAW_COUNT);
    });
  }
}

export default WebGlRenderProcessor;

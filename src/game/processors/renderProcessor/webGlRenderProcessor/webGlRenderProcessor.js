import ShaderBuilder from './shaderBuilder/shaderBuilder';
import webglUtils from 'vendor/webgl-utils';

import terrainPlatform from 'resources/graphics/terrain/platform.png';

class WebGlRenderProcessor {
  constructor() {
    const canvas = document.getElementById('root');
    this.gl = this.initGraphicContext(canvas);

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);
    this.gl.clear(
      this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT
    );

    webglUtils.resizeCanvasToDisplaySize(canvas, window.devicePixelRatio);
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);

    this.graphicInit = false;
    this.program = this.initShaders();
    this.initTextures()
      .then((image) => {
        this.image = image;
        this.initGraphics();
        this.graphicInit = true;
      });
  }

  initGraphicContext(canvas) {
    let graphicContext = null;

    try {
      graphicContext = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    } catch (e) {
      console.log('Unable to get graphic context.');
    }

    if (!graphicContext) {
      console.log('Unable to initialize WebGL. Your browser may not support it.');
    }

    return graphicContext;
  }

  initShaders() {
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

  initTextures() {
    return new Promise((resolve) => {
      const image = new Image();
      image.src = terrainPlatform;
      image.onload = () => {
        resolve(image);
      };
    });
  }

  initGraphics() {
    const attribSetters = webglUtils.createAttributeSetters(this.gl, this.program);

    const attribs = {
      position: {
        data: [
          0.0,  0.0,
          1.0,  0.0,
          0.0,  1.0,
          0.0,  1.0,
          1.0,  0.0,
          1.0,  1.0,
        ],
        numComponents: 2,
      },
      texCoord: {
        data: [
          0.0,  0.0,
          1.0,  0.0,
          0.0,  1.0,
          0.0,  1.0,
          1.0,  0.0,
          1.0,  1.0,
        ],
        numComponents: 2,
      },
    };
    const bufferInfo = webglUtils.createBufferInfoFromArrays(this.gl, attribs);

    this.gl.useProgram(this.program);

    webglUtils.setBuffersAndAttributes(this.gl, attribSetters, bufferInfo);

    const texture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);

    this.gl.texImage2D(
      this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.image
    );
  }

  process() {
    if (!this.graphicInit) {
      return;
    }
    const primitiveType = this.gl.TRIANGLES;
    const offset = 0;
    const count = 6;
    this.gl.drawArrays(primitiveType, offset, count);
  }
}

export default WebGlRenderProcessor;

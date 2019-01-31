import ShaderBuilder from './shaderBuilder/shaderBuilder';
import webglUtils from 'vendor/webgl-utils';

import terrainPlatform from 'resources/graphics/terrain/platform.png';

class WebGlRenderProcessor {
  constructor() {
    const window = document.getElementById('root');
    this.gl = this.initGraphicContext(window);

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.depthFunc(this.gl.LEQUAL);
    this.gl.clear(
      this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT
    );

    this.graphicInit = false;
    this.program = this.initShaders();
    this.initTextures()
      .then((image) => {
        this.image = image;
        this.initGraphics();
        this.graphicInit = true;
      });
  }

  initGraphicContext(window) {
    let graphicContext = null;

    try {
      graphicContext = window.getContext('webgl') || window.getContext('experimental-webgl');
    } catch (e) {
      console.log('Unable to get graphic context.');
    }

    if (!graphicContext) {
      console.log('Unable to initialize WebGL. Your browser may not support it.');
    }

    return graphicContext;
  }

  initShaders() {
    const shaderCreator = new ShaderBuilder(this.gl);

    const vertexShader = shaderCreator.create(shaderCreator.VERTEX_SHADER);
    const fragmentShader = shaderCreator.create(shaderCreator.FRAGMENT_SHADER);

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
    const setRectangle = (gl, x, y, width, height) => {
      const x1 = x;
      const x2 = x + width;
      const y1 = y;
      const y2 = y + height;
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        x1, y1,
        x2, y1,
        x1, y2,
        x1, y2,
        x2, y1,
        x2, y2,
      ]), gl.STATIC_DRAW);
    };

    const attribSetters = webglUtils.createAttributeSetters(this.gl, this.program);

    const attribs = {
      a_position: { buffer: this.gl.createBuffer(), numComponents: 2 },
      a_texCoord: { buffer: this.gl.createBuffer(), numComponents: 2 },
    };

    this.gl.useProgram(this.program);

    webglUtils.setAttributes(attribSetters, attribs);

    setRectangle(this.gl, 0, 0, this.image.width, this.image.height);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array([
        0.0,  0.0,
        1.0,  0.0,
        0.0,  1.0,
        0.0,  1.0,
        1.0,  0.0,
        1.0,  1.0,
      ]),
      this.gl.STATIC_DRAW
    );

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

import ShaderCreator from './shaderCreator';
import webglUtils from 'vendor/webgl-utils';

class WebGlRenderProcessor {
  constructor() {
    const window = document.getElementById('root');
    this.graphicContext = this.initGraphicContext(window);

    this.graphicContext.clearColor(0.0, 0.0, 0.0, 1.0);
    this.graphicContext.enable(this.graphicContext.DEPTH_TEST);
    this.graphicContext.depthFunc(this.graphicContext.LEQUAL);
    this.graphicContext.clear(
      this.graphicContext.COLOR_BUFFER_BIT | this.graphicContext.DEPTH_BUFFER_BIT
    );

    this.graphicInit = false;
    this.initShaders()
      .then(this.initBuffers())
      .then(() => {
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
    const shaderCreator = new ShaderCreator(this.graphicContext);
    const shadersConfigurations = [
      {
        path: 'resources/shaders/fragment.glsl',
        type: shaderCreator.FRAGMENT_SHADER,
      },
      {
        path: 'resources/shaders/vertex.glsl',
        type: shaderCreator.VERTEX_SHADER,
      },
    ];
    return Promise.all(shadersConfigurations.map((config) => {
      return shaderCreator.create(config.path, config.type);
    }))
      .then((shaders) => {
        const shaderProgram = this.graphicContext.createProgram();
        shaders.forEach((shader) => {
          this.graphicContext.attachShader(shaderProgram, shader);
        });

        this.graphicContext.linkProgram(shaderProgram);

        if (!this.graphicContext.getProgramParameter(shaderProgram, this.graphicContext.LINK_STATUS)) {
          console.log('Unable to initialize the shader program.');
        }

        this.graphicContext.useProgram(shaderProgram);
        const attrPositionLoc = this.graphicContext.getAttribLocation(shaderProgram, 'a_position');
        const attrTexCoordLoc = this.graphicContext.getAttribLocation(shaderProgram, 'a_texCoord');

        this.graphicContext.enableVertexAttribArray(attrPositionLoc);

        return attrPositionLoc;
      });
  }

  initBuffers(attrPositionLoc) {
    const positionBuffer = this.graphicContext.createBuffer();
    this.graphicContext.bindBuffer(this.graphicContext.ARRAY_BUFFER, positionBuffer);

    const positions = [
      0.0,  0.0,
      1.0,  0.0,
      0.0,  1.0,
      0.0,  1.0,
      1.0,  0.0,
      1.0,  1.0,
    ];
    this.graphicContext.bufferData(
      this.graphicContext.ARRAY_BUFFER,
      new Float32Array(positions),
      this.graphicContext.STATIC_DRAW
    );

    const size = 2;
    const type = this.graphicContext.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    this.graphicContext.vertexAttribPointer(attrPositionLoc, size, type, normalize, stride, offset);

    return Promise.resolve();
  }

  process() {
    if (!this.graphicInit) {
      return;
    }
    const primitiveType = this.graphicContext.TRIANGLES;
    const offset = 0;
    const count = 6;
    this.graphicContext.drawArrays(primitiveType, offset, count);
  }
}

export default WebGlRenderProcessor;

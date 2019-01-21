import ShaderCreator from './shaderLoader';

class RenderProcessor {
  constructor() {
    const window = document.getElementById('root');
    this.graphicContext = this.initGraphicContext(window);

    this.graphicContext.clearColor(0.0, 0.0, 0.0, 1.0);
    this.graphicContext.enable(this.graphicContext.DEPTH_TEST);
    this.graphicContext.depthFunc(this.graphicContext.LEQUAL);
    this.graphicContext.clear(
      this.graphicContext.COLOR_BUFFER_BIT | this.graphicContext.DEPTH_BUFFER_BIT
    );

    this.initShaders();
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

    const fragmentShader = shaderCreator.create(
      'resources/shaders/fragment.glsl',
      shaderCreator.FRAGMENT_SHADER
    );
    const vertexShader = shaderCreator.create(
      'resources/shaders/vertex.glsl',
      shaderCreator.VERTEX_SHADER
    );

    const shaderProgram = this.graphicContext.createProgram();
    this.graphicContext.attachShader(shaderProgram, vertexShader);
    this.graphicContext.attachShader(shaderProgram, fragmentShader);
    this.graphicContext.linkProgram(shaderProgram);

    if (!this.graphicContext.getProgramParameter(shaderProgram, this.graphicContext.LINK_STATUS)) {
      console.log('Unable to initialize the shader program.');
    }

    this.graphicContext.useProgram(shaderProgram);

    const vertexPositionAttribute =
      this.graphicContext.getAttribLocation(shaderProgram, 'aVertexPosition');
    this.graphicContext.enableVertexAttribArray(vertexPositionAttribute);
  }

  run() {

  }

  stop() {

  }

  process() {

  }
}

export default RenderProcessor;

import fragmentShader from './fragmentShader';
import vertexShader from './vertexShader';

const FRAGMENT_SHADER = 'FRAGMENT_SHADER';
const VERTEX_SHADER = 'VERTEX_SHADER';

const shaders = {
  [FRAGMENT_SHADER]: fragmentShader,
  [VERTEX_SHADER]: vertexShader,
};

class ShaderBuilder {
  constructor(graphicContext) {
    this.graphicContext = graphicContext;
    this.FRAGMENT_SHADER = FRAGMENT_SHADER;
    this.VERTEX_SHADER = VERTEX_SHADER;
    this.creators = {
      [FRAGMENT_SHADER]: this._createFragmentShader.bind(this),
      [VERTEX_SHADER]: this._createVertexShader.bind(this),
    };
  }

  _createFragmentShader() {
    return this.graphicContext.createShader(this.graphicContext.FRAGMENT_SHADER);
  }

  _createVertexShader() {
    return this.graphicContext.createShader(this.graphicContext.VERTEX_SHADER);
  }

  create(type) {
    const shader = this.creators[type]();
    this.graphicContext.shaderSource(shader, shaders[type]);
    this.graphicContext.compileShader(shader);

    if (!this.graphicContext.getShaderParameter(shader, this.graphicContext.COMPILE_STATUS)) {
      const errorLog = this.graphicContext.getShaderInfoLog(shader);
      throw new Error(`An error occurred compiling the shaders: ${errorLog}`);
    }

    return shader;
  }
}

export default ShaderBuilder;

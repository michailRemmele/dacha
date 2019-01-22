const FRAGMENT_SHADER = 'FRAGMENT_SHADER';
const VERTEX_SHADER = 'VERTEX_SHADER';

class ShaderCreator {
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

  create(fileUrl, type) {
    let shader = null;
    return fetch(fileUrl)
      .then((result) => {
        return result.text();
      })
      .then((shaderSource) => {
        shader = this.creators[type]();
        this.graphicContext.shaderSource(shader, shaderSource);
        this.graphicContext.compileShader(shader);

        if (!this.graphicContext.getShaderParameter(shader, this.graphicContext.COMPILE_STATUS)) {
          const errorLog = this.graphicContext.getShaderInfoLog(shader);
          throw new Error(`An error occurred compiling the shaders: ${errorLog}`);
        }

        return shader;
      });
  }
}

export default ShaderCreator;

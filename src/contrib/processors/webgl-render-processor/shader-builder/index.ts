import { fragmentShader } from './fragment-shader';
import { vertexShader } from './vertex-shader';

export const FRAGMENT_SHADER = 'FRAGMENT_SHADER';
export const VERTEX_SHADER = 'VERTEX_SHADER';

export { ShaderProvider } from './shader-provider';

const shaders = {
  [FRAGMENT_SHADER]: fragmentShader,
  [VERTEX_SHADER]: vertexShader,
};

export class ShaderBuilder {
  private graphicContext: WebGL2RenderingContext;
  private creators: Record<string, () => WebGLShader | null>;

  constructor(graphicContext: WebGL2RenderingContext) {
    this.graphicContext = graphicContext;
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

  create(type: 'FRAGMENT_SHADER' | 'VERTEX_SHADER') {
    const shader = this.creators[type]();

    if (!shader) {
      throw new Error(`Can't create shader with same type: ${type}`);
    }

    this.graphicContext.shaderSource(shader, shaders[type]);
    this.graphicContext.compileShader(shader);

    if (!this.graphicContext.getShaderParameter(shader, this.graphicContext.COMPILE_STATUS)) {
      const errorLog = this.graphicContext.getShaderInfoLog(shader);
      throw new Error(`An error occurred compiling the shaders${errorLog ? `: ${errorLog}` : ''}`);
    }

    return shader;
  }
}

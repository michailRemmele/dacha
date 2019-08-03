import Component from 'engine/component/component';

class Camera extends Component {
  clone() {
    return new Camera();
  }
}

export default Camera;

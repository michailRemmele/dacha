import Processor from 'engine/processor/processor';

const FPS_UPDATE_MESSAGE = 'FPS_UPDATE';
const MS_IN_SEC = 1000;

class FpsMeter extends Processor {
  constructor(options) {
    super();

    this._frequency = options.frequency || MS_IN_SEC;

    this._fps = 0;
    this._time = 0;
  }

  process(options) {
    const { messageBus, deltaTime } = options;

    this._fps += 1;
    this._time += deltaTime;

    if (this._time >= this._frequency) {
      messageBus.send({
        type: FPS_UPDATE_MESSAGE,
        fps: this._fps * MS_IN_SEC / this._time,
      });

      this._fps = 0;
      this._time = 0;
    }
  }
}

export default FpsMeter;

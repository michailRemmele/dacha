class Processor {
  processorDidMount() {
  }

  processorWillUnmount() {
  }

  process() {
    throw new Error('You should override this function');
  }
}

export default Processor;

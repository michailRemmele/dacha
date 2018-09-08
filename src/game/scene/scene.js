class Scene {
  constructor(configuration) {
    this.configuration = configuration;
  }

  getName() {
    return this.configuration.name;
  }
}

export default Scene;

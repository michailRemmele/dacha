const script = class ChangeSceneAction {
  getName() {
    return 'changeSceneAction';
  }

  execute(args) {
    const sceneName = args[0];
    const IOC = args[1];
    const global = args[2];

    const sceneProvider = IOC.resolve(global.SCENE_PROVIDER_KEY_NAME);
    sceneProvider.setCurrentScene(sceneName);
  }
};

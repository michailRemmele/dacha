import Engine from './game/engine';

const options = {
  mainConfig: 'resources/configurations/mainConfig.json',
  window: document.getElementById('root'),
  textureAtlas: {
    texture: 'resources/textureAtlas.png',
    descriptor: 'resources/textureAtlasMap.json',
  },
};

const engine = new Engine(options);
engine.start();

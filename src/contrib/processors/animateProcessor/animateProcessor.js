import Processor from 'engine/processor/processor';
import IOC from 'engine/ioc/ioc';

import conditionControllers from './conditionControllers';

import * as global from 'engine/consts/global';
const FRAME_RATE = 100;

const RENDERABLE_COMPONENT_NAME = 'renderable';
const ANIMATABLE_COMPONENT_NAME = 'animatable';

class AnimateProcessor extends Processor {
  getComponentList() {
    return [
      RENDERABLE_COMPONENT_NAME,
      ANIMATABLE_COMPONENT_NAME,
    ];
  }

  _validateGameObject(gameObject) {
    return this.getComponentList().every((component) => {
      return !!gameObject.getComponent(component);
    });
  }

  process(options) {
    const deltaTime = options.deltaTime;
    const messageBus = options.messageBus;

    const sceneProvider = IOC.resolve(global.SCENE_PROVIDER_KEY_NAME);
    const currentScene = sceneProvider.getCurrentScene();

    currentScene.forEachPlacedGameObject((gameObject) => {
      if (!this._validateGameObject(gameObject))  {
        return;
      }

      const renderable = gameObject.getComponent(RENDERABLE_COMPONENT_NAME);
      const animatable = gameObject.getComponent(ANIMATABLE_COMPONENT_NAME);

      const nextTransition = animatable.currentState.transitions.find((transition) => {
        return transition.conditions.some((condition) => {
          const ConditionController = conditionControllers[condition.type];
          const conditionController = new ConditionController({
            ...condition.props,
            gameObject: gameObject,
          });
          return conditionController.check(messageBus);
        });
      });

      if (nextTransition) {
        const previousState = animatable.currentState.name;
        animatable.currentState = nextTransition.state;
        animatable.currentState.previousState = previousState;
        animatable.duration = 0;
      }

      const strip = animatable.currentState.strip;
      const startFrame = strip.from;
      const framesCount = strip.to - strip.from + 1;
      const speed = animatable.currentState.speed;
      const actualFrameRate = FRAME_RATE / speed;
      const baseDuration = framesCount * actualFrameRate;

      animatable.duration += deltaTime;

      if (animatable.duration > baseDuration) {
        if (!animatable.currentState.looped) {
          animatable.currentState
            = animatable.currentState.previousState || animatable.defaultState;
          animatable.duration = 0;
          renderable.currentFrame = animatable.currentState.strip.from;
          return;
        } else {
          animatable.duration %= baseDuration;
        }
      }

      renderable.currentFrame = startFrame + Math.trunc(animatable.duration / actualFrameRate);
    });
  }
}

export default AnimateProcessor;

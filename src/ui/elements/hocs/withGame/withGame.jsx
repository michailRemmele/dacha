import React from 'react';

import GameContext from '../../../contexts/gameContext/gameContext';

function withGame(WrappedComponent) {
  class WithGame extends React.Component {
    render() {
      return (
        <GameContext.Consumer>
          {({ messageBusObserver, pushMessage, gameObjects }) => (
            <WrappedComponent
              messageBusObserver={messageBusObserver}
              pushMessage={pushMessage}
              gameObjects={gameObjects}
              {...this.props}
            />
          )}
        </GameContext.Consumer>
      );
    }
  }

  WithGame.displayName = `WithGame(${getDisplayName(WrappedComponent)})`;
  return WithGame;
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default withGame;

import React from 'react';
import PropTypes from 'prop-types';

import GameContext from '../../../contexts/gameContext/gameContext';

class GameProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {
        messageBusObserver: this.props.messageBusObserver,
        pushMessage: this.props.pushMessage,
        gameObjects: this.props.gameObjects,
      },
    };
  }

  render() {
    return (
      <GameContext.Provider value={this.state.value}>
        {this.props.children}
      </GameContext.Provider>
    );
  }
}

GameProvider.propTypes = {
  children: PropTypes.node,
  messageBusObserver: PropTypes.any,
  pushMessage: PropTypes.func,
  gameObjects: PropTypes.any,
};

export default GameProvider;

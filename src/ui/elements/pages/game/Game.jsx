import React from 'react';
import PropTypes from 'prop-types';

import withGame from '../../hocs/withGame/withGame';

import HealthBar from '../../components/healthBar/HealthBar';
import WeaponBar from '../../components/weaponBar/WeaponBar';
import Button from '../../atoms/button/Button';

import './style.css';

const VICTORY_MSG = 'VICTORY';
const DEFEAT_MSG = 'DEFEAT';
const LOAD_SCENE_MSG = 'LOAD_SCENE';
const GAME_SCENE_NAME = 'game';
const MAIN_MENU_SCENE_NAME = 'mainMenu';

const PAGE_STATE = {
  GAME: 'game',
  VICTORY: 'victory',
  DEFEAT: 'defeat',
};

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pageState: PAGE_STATE.GAME,
    };

    this.renderStateStrategy = {
      [PAGE_STATE.GAME]: () => this.renderHud(),
      [PAGE_STATE.VICTORY]: () => (
        <>
          {this.renderHud()}
          <div className='game__overlay'>
            {this.renderVictoryDialog()}
          </div>
        </>
      ),
      [PAGE_STATE.DEFEAT]: () => (
        <>
          {this.renderHud()}
          <div className='game__overlay'>
            {this.renderDefeatDialog()}
          </div>
        </>
      ),
    };
    this.messageBusSubscription = this.onMessageBusUpdate.bind(this);
  }

  componentDidMount() {
    this.props.messageBusObserver.subscribe(this.messageBusSubscription);
  }

  componentWillUnmount() {
    this.props.messageBusObserver.unsubscribe(this.messageBusSubscription);
  }

  onMessageBusUpdate(messageBus) {
    if (messageBus.get(VICTORY_MSG)) {
      this.setState({ pageState: PAGE_STATE.VICTORY });
    } else if (messageBus.get(DEFEAT_MSG)) {
      this.setState({ pageState: PAGE_STATE.DEFEAT });
    }
  }

  onRestart() {
    this.props.pushMessage({
      type: LOAD_SCENE_MSG,
      name: GAME_SCENE_NAME,
    });
  }

  onMainMenu() {
    this.props.pushMessage({
      type: LOAD_SCENE_MSG,
      name: MAIN_MENU_SCENE_NAME,
    });
  }

  renderDialog(title) {
    return (
      <div className='game__dialog dialog'>
        <h2 className='dialog__title'>{title}</h2>
        <footer className='dialog__footer'>
          <Button className='dialog__button' title='Restart' onClick={() => this.onRestart()} />
          <Button className='dialog__button' title='Main menu' onClick={() => this.onMainMenu()} />
        </footer>
      </div>
    );
  }

  renderDefeatDialog() {
    return this.renderDialog('Defeat');
  }

  renderVictoryDialog() {
    return this.renderDialog('Victory');
  }

  renderHud() {
    return (
      <>
        <HealthBar health={100}/>
        <WeaponBar className='game__weapon-bar' name={'Blaster'} cooldown={60}/>
      </>
    );
  }

  render() {
    return (
      <div className='game'>
        {this.renderStateStrategy[this.state.pageState]()}
      </div>
    );
  }
}

Game.propTypes = {
  messageBusObserver: PropTypes.any,
  pushMessage: PropTypes.func,
};

export default withGame(Game);

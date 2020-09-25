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

const PLAYER_ID = '1';
const HEALTH_COMPONENT_NAME = 'health';
const WEAPON_COMPONENT_NAME = 'weapon';

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
    this.playerSubscription = this.onPlayerUpdate.bind(this);
  }

  componentDidMount() {
    this.props.messageBusObserver.subscribe(this.messageBusSubscription);
    this.props.gameObjects.subscribe(this.playerSubscription, PLAYER_ID);
  }

  componentWillUnmount() {
    this.props.messageBusObserver.unsubscribe(this.messageBusSubscription);
    this.props.gameObjects.unsubscribe(this.playerSubscription, PLAYER_ID);
  }

  onMessageBusUpdate(messageBus) {
    if (messageBus.get(VICTORY_MSG)) {
      this.setState({ pageState: PAGE_STATE.VICTORY });
    } else if (messageBus.get(DEFEAT_MSG)) {
      this.setState({ pageState: PAGE_STATE.DEFEAT });
    }
  }

  onPlayerUpdate(gameObject) {
    if (!gameObject) {
      this.setState({
        health: 0,
        isReload: false,
      });
      return;
    }

    const health = gameObject.getComponent(HEALTH_COMPONENT_NAME);
    const weapon = gameObject.getComponent(WEAPON_COMPONENT_NAME);

    const newState = {};

    if (health.points !== this.state.health) {
      newState.health = health.points;
    }

    const isReload = weapon.cooldownRemaining > 0;
    if (isReload !== this.state.isReload) {
      newState.isReload = isReload;
    }

    if (weapon.name !== this.state.weaponName) {
      newState.weaponName = weapon.name;
    }

    if (Object.keys(newState).length) {
      this.setState(newState);
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
        <HealthBar health={this.state.health}/>
        <WeaponBar
          className='game__weapon-bar'
          name={this.state.weaponName}
          isReload={this.state.isReload}
        />
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
  gameObjects: PropTypes.any,
};

export default withGame(Game);

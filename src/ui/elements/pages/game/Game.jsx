import React from 'react';

import HealthBar from '../../components/healthBar/HealthBar';
import WeaponBar from '../../components/weaponBar/WeaponBar';
import Button from '../../atoms/button/Button';

import './style.css';

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
  }

  renderDialog(title) {
    return (
      <div className='game__dialog dialog'>
        <h2 className='dialog__title'>{title}</h2>
        <footer className='dialog__footer'>
          <Button className='dialog__button' title='Restart' />
          <Button className='dialog__button' title='Main menu' />
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

Game.propTypes = {};

export default Game;

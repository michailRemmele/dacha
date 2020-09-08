import React from 'react';

import HealthBar from '../../components/healthBar/HealthBar';
import WeaponBar from '../../components/weaponBar/WeaponBar';

import './style.css';

class Game extends React.Component {
  render() {
    return (
      <div className='game'>
        <HealthBar health={100}/>
        <WeaponBar className='game__weapon-bar' name={'Blaster'} cooldown={60}/>
      </div>
    );
  }
}

Game.propTypes = {};

export default Game;

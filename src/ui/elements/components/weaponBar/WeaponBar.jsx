import React from 'react';
import PropTypes from 'prop-types';

import './style.css';

class WeaponBar extends React.Component {
  renderCooldownSection() {
    if (!this.props.cooldown) {
      return;
    }

    return (
      <div className='weapon-bar__section'>
        <span className='weapon-bar__label'>
          Reload
        </span>
        <span className='weapon-bar__value'>
          {this.props.cooldown}
        </span>
      </div>
    );
  }

  render() {
    return (
      <div className={`weapon-bar ${this.props.className}`}>
        {this.renderCooldownSection()}
        <div className='weapon-bar__section'>
          <span className='weapon-bar__label'>
            Weapon
          </span>
          <span className='weapon-bar__value'>
            {this.props.name}
          </span>
        </div>
      </div>
    );
  }
}

WeaponBar.defaultProps = {
  className: '',
};

WeaponBar.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  cooldown: PropTypes.number,
};

export default WeaponBar;

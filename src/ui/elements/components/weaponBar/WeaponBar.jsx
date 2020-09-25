import React from 'react';
import PropTypes from 'prop-types';

import './style.css';

class WeaponBar extends React.PureComponent {
  renderCooldownSection() {
    if (!this.props.isReload) {
      return;
    }

    return (
      <div className='weapon-bar__section weapon-bar__section_reload'>
        Reload
      </div>
    );
  }

  render() {
    return (
      <div className={`weapon-bar ${this.props.className}`}>
        {this.renderCooldownSection()}
        <div className='weapon-bar__section'>
          {`Weapon: ${this.props.name || ''}`}
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
  name: PropTypes.string,
  isReload: PropTypes.bool,
};

export default WeaponBar;

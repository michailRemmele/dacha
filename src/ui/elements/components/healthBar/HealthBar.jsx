import React from 'react';
import PropTypes from 'prop-types';

import './style.css';

class HealthBar extends React.PureComponent {
  render() {
    return (
      <div className={`health-bar ${this.props.className}`}>
        Health: {this.props.health || ''}
      </div>
    );
  }
}

HealthBar.defaultProps = {
  className: '',
};

HealthBar.propTypes = {
  className: PropTypes.string,
  health: PropTypes.number,
};

export default HealthBar;

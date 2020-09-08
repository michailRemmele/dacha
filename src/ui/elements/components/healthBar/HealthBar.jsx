import React from 'react';
import PropTypes from 'prop-types';

import './style.css';

class HealthBar extends React.Component {
  render() {
    return (
      <div className={`health-bar ${this.props.className}`}>
        Health: {this.props.health}
      </div>
    );
  }
}

HealthBar.defaultProps = {
  className: '',
};

HealthBar.propTypes = {
  className: PropTypes.string,
  health: PropTypes.number.isRequired,
};

export default HealthBar;

import React from 'react';
import PropTypes from 'prop-types';

import './style.css';

class Button extends React.Component {
  render() {
    return (
      <button
        className={`button ${this.props.className}`}
        onClick={this.props.onClick}
      >
        {this.props.title}
      </button>
    );
  }
}

Button.defaultProps = {
  className: '',
  title: '',
  onClick: () => {},
};

Button.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  onClick: PropTypes.func,
};

export default Button;

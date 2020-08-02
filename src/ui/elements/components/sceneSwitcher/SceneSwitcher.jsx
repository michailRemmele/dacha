import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

class SceneSwitcher extends React.Component {
  componentDidMount() {
    this.props.history.push(`/${this.props.sceneName}`);
  }

  render() {
    return (
      <React.Fragment>
        {this.props.children}
      </React.Fragment>
    );
  }
}

SceneSwitcher.propTypes = {
  children: PropTypes.node.isRequired,
  history: PropTypes.object.isRequired,
  sceneName: PropTypes.string.isRequired,
};

export default withRouter(SceneSwitcher);

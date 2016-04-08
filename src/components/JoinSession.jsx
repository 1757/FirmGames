import React, { PropTypes } from 'react';
import { Link, browserHistory } from 'react-router';
import { Dialog, RaisedButton, TextField } from 'material-ui';

class JoinSession extends React.Component {
  constructor(props) {
    super(props);
    const fullPath = props.location.pathname;
    const parentPath = fullPath.replace(props.route.path, '');
    this.parentPath = parentPath;
    this.state = {
      sessionId: null,
    };
    this.handleTextChange = this.handleTextChange.bind(this);
  }
  handleTextChange(event, value) {
    this.setState({ sessionId: value });
  }
  handleKey(event) {
    if (event.keyCode === 13) {
      browserHistory.push(`${this.parentPath}session/${this.state.sessionId}`);
    }
  }
  render() {
    return (
      <Dialog
        title="Enter Session ID"
        actions={[
          <Link to = {`${this.parentPath}session/${this.state.sessionId}`}>
            <RaisedButton
              label="OK"
              secondary
            />
          </Link>,
        ]}
        modal
        open
      >
        <TextField
          hintText="Session ID"
          type="text"
          onChange={this.handleTextChange}
          onKeyDown={this.handleKey}
        />
      </Dialog>
    );
  }
}

JoinSession.propTypes = {
  location: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
};

module.exports = JoinSession;

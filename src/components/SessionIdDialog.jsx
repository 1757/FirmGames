import React, { PropTypes } from 'react';
import { Dialog, RaisedButton, TextField } from 'material-ui';

const SessionIdDialog = ({ open, onChange, onTouchTap, onKeyDown }) => (
  <Dialog
    title="Enter Session ID"
    actions={[
      <RaisedButton
        label="OK"
        secondary
        onTouchTap={onTouchTap}
      />,
    ]}
    modal
    open={open}
  >
    <TextField
      hintText="Session ID"
      type="text"
      onChange={onChange}
      onKeyDown={onKeyDown}
    />
  </Dialog>
);

SessionIdDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onTouchTap: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired,
};

module.exports = SessionIdDialog;

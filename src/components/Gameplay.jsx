import React, { PropTypes } from 'react';
import { Slider, RaisedButton } from 'material-ui';

class Gameplay extends React.Component {
  componentDidMount() {
    this.props.sliderOptions.onChange(null, this.props.sliderOptions.defaultValue);
  }
  render() {
    return (
      <div className="row">
        <div className="eleven columns">
          <Slider {...this.props.sliderOptions} />
        </div>
        <div className="one column">
          <RaisedButton {...this.props.buttonOptions} secondary label={'BID'} />
        </div>
      </div>
    );
  }
}

Gameplay.propTypes = {
  buttonOptions: PropTypes.object.isRequired,
  sliderOptions: PropTypes.object.isRequired,
};

module.exports = Gameplay;

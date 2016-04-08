import React, { PropTypes } from 'react';

import config from 'src/config';
import Page from 'src/components/Page';

class SupplierPageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wholesalePrice: null,
    };
    this.handleWholesalePriceChange = this.handleWholesalePriceChange.bind(this);
    this.handleBidSubmit = this.handleBidSubmit.bind(this);
  }
  handleWholesalePriceChange(event, newPrice) {
    this.setState({ wholesalePrice: newPrice });
  }
  handleBidSubmit() {
    const bid = {
      Completed: false,
      'Wholesale Price': this.state.wholesalePrice,
    };
    this.props.handleBidSubmit(bid);
  }
  render() {
    let isTurn;
    const snapshot = this.props.currentBidSnapshot;
    if (!snapshot) {
      isTurn = true;
    } else {
      isTurn = snapshot.val().Completed;
    }

    const props = {
      sliderOptions: {
        min: config.productionCost,
        max: config.retailPrice,
        defaultValue: config.defaultPrice,
        step: config.priceStep,
        description: `Wholesale Price: ${this.state.wholesalePrice}`,
        onChange: this.handleWholesalePriceChange,
      },
      buttonOptions: {
        disabled: !isTurn,
        onTouchTap: this.handleBidSubmit,
      },
      bids: this.props.bids,
    };
    return (
      <Page {...props} />
    );
  }
}

SupplierPageContainer.propTypes = {
  handleBidSubmit: PropTypes.func.isRequired,
  currentBidSnapshot: PropTypes.object,
  bids: PropTypes.array.isRequired,
};

module.exports = SupplierPageContainer;

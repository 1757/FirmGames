import React, { PropTypes } from 'react';

import config from 'src/config';
import Page from 'src/components/Page';

class RetailerPageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quantity: null,
    };
    this.handleQuantityChange = this.handleQuantityChange.bind(this);
    this.handleBidSubmit = this.handleBidSubmit.bind(this);
  }
  handleQuantityChange(event, newQuantity) {
    this.setState({ quantity: newQuantity });
  }
  handleBidSubmit() {
    const demand = Math.ceil(100 * Math.random());
    const quantity = this.state.quantity;
    const currentWholesalePrice = this.props.currentBidSnapshot.val()['Wholesale Price'];
    const bid = {
      Completed: true,
      'Wholesale Price': currentWholesalePrice,
      Quantity: quantity,
      Demand: demand,
      'Retailer Profit': config.retailPrice * demand - currentWholesalePrice * quantity,
      'Supplier Profit': (currentWholesalePrice - config.productionCost) * quantity,
    };
    this.props.handleBidSubmit(bid);
  }
  render() {
    let isTurn;
    const snapshot = this.props.currentBidSnapshot;
    if (!snapshot) {
      isTurn = false;
    } else {
      isTurn = !snapshot.val().Completed;
    }
    const props = {
      sliderOptions: {
        min: config.minimumQuantity,
        max: config.maximumQuantity,
        defaultValue: config.defaultQuantity,
        step: config.quantityStep,
        description: `Quantity: ${this.state.quantity}`,
        onChange: this.handleQuantityChange,
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

RetailerPageContainer.propTypes = {
  handleBidSubmit: PropTypes.func.isRequired,
  currentBidSnapshot: PropTypes.object,
  bids: PropTypes.array.isRequired,
};

module.exports = RetailerPageContainer;

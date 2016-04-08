import React from 'react';
import Firebase from 'firebase';
import _ from 'lodash';

import config from 'src/config';
import Page from 'src/components/Page';

class SingleLogicContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentWholesalePrice: null,
      optimalQuantity: null,
      expectedRetailerProfit: null,
      expectedSupplierProfit: null,
      bids: [],
    };
    this.onWholesalePriceChange = this.onWholesalePriceChange.bind(this);
    this.onBidSubmit = this.onBidSubmit.bind(this);
  }
  onWholesalePriceChange(event, newPrice) {
    const optimalQuantity = Math.floor(100 * newPrice / config.retailPrice);
    const expectedSale = (100.5 - optimalQuantity / 2) * (optimalQuantity / 100);
    const expectedRetailerProfit = config.retailPrice * expectedSale - newPrice * optimalQuantity;
    const expectedSupplierProfit = (newPrice - config.productionCost) * optimalQuantity;
    this.setState({
      currentWholesalePrice: newPrice,
      optimalQuantity,
      expectedRetailerProfit,
      expectedSupplierProfit,
    });
  }
  onBidSubmit() {
    const demand = Math.ceil(100 * Math.random());
    const bid = {
      'Wholesale Price': this.state.currentWholesalePrice,
      Quantity: this.state.optimalQuantity,
      Demand: demand,
      'Retailer Profit': config.retailPrice * demand
                            - this.state.currentWholesalePrice * this.state.optimalQuantity,
      'Supplier Profit': (this.state.currentWholesalePrice - config.productionCost)
                          * this.state.optimalQuantity,
    };
    // this.firebaseRef.
    this.setState({ bids: _.concat([bid], this.state.bids) });
  }
  render() {
    const props = {
      dialogOptions: {
        open: this.state.dialogOpen,
        onChange: this.handleSessionIdChange,
        onKeyDown: this.handleSessionIdInputKey,
        onTouchTap: this.fetchSession,
      },
      sliderOptions: {
        min: config.productionCost,
        max: config.retailPrice,
        defaultValue: config.defaultPrice,
        step: config.priceStep,
        description: `Wholesale Price: ${this.state.currentWholesalePrice}`,
        onChange: this.onWholesalePriceChange,
      },
      buttonOptions: {
        onTouchTap: this.onBidSubmit,
      },
      bids: this.state.bids,
    };
    return (
      <Page {...props} />
    );
  }
}

module.exports = SingleLogicContainer;

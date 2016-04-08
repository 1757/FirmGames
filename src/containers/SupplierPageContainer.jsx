import React from 'react';
import Firebase from 'firebase';
import _ from 'lodash';

import config from 'src/config';
import Page from 'src/components/Page';

class SupplierLogicContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionId: null,
      currentWholesalePrice: null,
      optimalQuantity: null,
      expectedRetailerProfit: null,
      expectedSupplierProfit: null,
      bids: {},
      dialogOpen: true,
      isTurn: true,
    };
    this.onWholesalePriceChange = this.onWholesalePriceChange.bind(this);
    this.onBidSubmit = this.onBidSubmit.bind(this);
    this.handleSessionIdChange = this.handleSessionIdChange.bind(this);
    this.handleSessionIdInputKey = this.handleSessionIdInputKey.bind(this);
    this.createSession = this.createSession.bind(this);
    this.handleBidSnapshot = this.handleBidSnapshot.bind(this);
  }
  componentDidMount() {
    this.firebaseRef = new Firebase(`${config.firebaseRoot}games`);
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
    if (!this.bidsRef) {
      return alert('Database not available');
    }
    const bid = {
      Completed: false,
      'Wholesale Price': this.state.currentWholesalePrice,
    };
    return this.bidsRef.push(bid).then((bidRef) => {
      console.log(bidRef.toString());
    });
    // this.setState({ bids: _.concat([bid], this.state.bids) });
  }
  handleBidSnapshot(snapshot) {
    const bid = {};
    bid[snapshot.key()] = snapshot.val();
    this.setState({
      bids: _.assign({}, this.state.bids, bid),
      isTurn: snapshot.val().Completed,
    });
  }
  handleSessionIdChange(event, value) {
    this.setState({ sessionId: value });
  }
  handleSessionIdInputKey(event) {
    if (event.keyCode === 13) {
      this.createSession();
    }
  }
  createSession() {
    this.setState({ dialogOpen: false });
    this.firebaseRef.push({
      started_at: Firebase.ServerValue.TIMESTAMP,
      id: this.state.sessionId,
      bids: [],
    }).then((ref) => {
      console.log(ref.toString());
      this.gameRef = ref;
      this.bidsRef = ref.child('bids');
      this.bidsRef.on('child_added', this.handleBidSnapshot);
      this.bidsRef.on('child_changed', this.handleBidSnapshot);
    }).catch(err => {
      console.error(err);
      alert(err);
    });
  }
  render() {
    const props = {
      dialogOptions: {
        open: this.state.dialogOpen,
        onChange: this.handleSessionIdChange,
        onKeyDown: this.handleSessionIdInputKey,
        onTouchTap: this.createSession,
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
        disabled: !this.state.isTurn,
        onTouchTap: this.onBidSubmit,
      },
      bids: _.values(this.state.bids),
    };
    return (
      <Page {...props} />
    );
  }
}

module.exports = SupplierLogicContainer;

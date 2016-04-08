import React from 'react';
import Firebase from 'firebase';
import _ from 'lodash';

import config from 'src/config';
import Page from 'src/components/Page';

class RetailerLogicContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionId: null,
      currentWholesalePrice: null,
      currentQuantity: null,
      optimalQuantity: null,
      expectedRetailerProfit: null,
      expectedSupplierProfit: null,
      bids: {},
      dialogOpen: true,
    };
    this.onQuantityChange = this.onQuantityChange.bind(this);
    this.onBidSubmit = this.onBidSubmit.bind(this);
    this.handleSessionIdChange = this.handleSessionIdChange.bind(this);
    this.handleSessionIdInputKey = this.handleSessionIdInputKey.bind(this);
    this.handleBidSnapshot = this.handleBidSnapshot.bind(this);
    this.fetchSession = this.fetchSession.bind(this);
  }
  componentDidMount() {
    this.firebaseRef = new Firebase(`${config.firebaseRoot}games`);
    this.gameRef = null;
    this.bidsRef = null;
    this.currentBidRef = null;
  }
  onQuantityChange(event, newQuantity) {
    this.setState({ currentQuantity: newQuantity });
  }
  onBidSubmit() {
    if (!this.bidsRef) {
      return alert('Database not available');
    }
    if (!this.currentBidRef) {
      return alert('Not your turn');
    }
    const demand = Math.ceil(100 * Math.random());
    const currentWholesalePrice = this.state.bids[this.currentBidRef.key()]['Wholesale Price'];
    const bid = {
      Completed: true,
      'Wholesale Price': currentWholesalePrice,
      Quantity: this.state.currentQuantity,
      Demand: demand,
      'Retailer Profit': config.retailPrice * demand
                            - currentWholesalePrice * this.state.currentQuantity,
      'Supplier Profit': (currentWholesalePrice - config.productionCost)
                          * this.state.currentQuantity,
    };
    return this.currentBidRef.set(bid);
  }
  handleBidSnapshot(snapshot) {
    const bid = {};
    bid[snapshot.key()] = snapshot.val();
    if (!snapshot.val().Completed) {
      this.currentBidRef = snapshot.ref();
    } else {
      this.currentBidRef = null;
    }
    this.setState({
      bids: _.assign({}, this.state.bids, bid),
    });
  }
  handleSessionIdChange(event, value) {
    this.setState({ sessionId: value });
  }
  handleSessionIdInputKey(event) {
    if (event.keyCode === 13) {
      this.fetchSession();
    }
  }
  fetchSession() {
    this.firebaseRef
      .orderByChild('id')
      .equalTo(this.state.sessionId)
      .once('child_added')
      .then(snapshot => {
        if (snapshot.exists()) {
          const ref = snapshot.ref();
          console.log(ref.toString());
          this.gameRef = ref;
          this.bidsRef = ref.child('bids');
          this.bidsRef.on('child_added', this.handleBidSnapshot);
          this.bidsRef.on('child_changed', this.handleBidSnapshot);
          this.setState({ dialogOpen: false });
        } else {
          alert('Session does not exist');
        }
      });
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
        min: config.minimumQuantity,
        max: config.maximumQuantity,
        defaultValue: config.defaultQuantity,
        step: config.quantityStep,
        description: `Quantity: ${this.state.currentQuantity}`,
        onChange: this.onQuantityChange,
      },
      buttonOptions: {
        disabled: !this.currentBidRef,
        onTouchTap: this.onBidSubmit,
      },
      bids: _.values(this.state.bids),
    };
    return (
      <Page {...props} />
    );
  }
}

module.exports = RetailerLogicContainer;

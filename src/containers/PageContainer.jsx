import React, { PropTypes } from 'react';
import Firebase from 'firebase';
import _ from 'lodash';

import config from 'src/config';

class PageContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionId: null,
      bids: {},
      currentBidSnapshot: null,
    };
    this.fetchSession = this.fetchSession.bind(this);
    this.createSession = this.createSession.bind(this);
    this.initGameRef = this.initGameRef.bind(this);
    this.handleBidSnapshot = this.handleBidSnapshot.bind(this);
    this.handleBidSubmit = this.handleBidSubmit.bind(this);
  }
  componentDidMount() {
    this.firebaseRef = new Firebase(`${config.firebaseRoot}games`);
    this.gameRef = null;
    this.bidsRef = null;
    this.fetchSession();
  }
  fetchSession() {
    this.firebaseRef
      .orderByChild('id')
      .equalTo(this.props.params.sessionId)
      .once('value')
      .then(snapshot => {
        if (snapshot.exists()) {
          const key = _.keys(snapshot.val())[0];
          const ref = snapshot.ref().child(key);
          console.log('Ref fetched:', ref.toString());
          this.initGameRef(ref);
        } else {
          this.createSession();
        }
      }).catch(err => {
        console.error(err);
        alert(err);
      });
  }
  createSession() {
    this.firebaseRef.push({
      started_at: Firebase.ServerValue.TIMESTAMP,
      id: this.props.params.sessionId,
      bids: [],
    }).then((ref) => {
      console.log('Ref created:', ref.toString());
      this.initGameRef(ref);
    }).catch(err => {
      console.error(err);
      alert(err);
    });
  }
  initGameRef(ref) {
    this.gameRef = ref;
    this.bidsRef = ref.child('bids');
    this.bidsRef.on('child_added', this.handleBidSnapshot);
    this.bidsRef.on('child_changed', this.handleBidSnapshot);
  }
  handleBidSnapshot(snapshot) {
    const bid = {};
    bid[snapshot.key()] = snapshot.val();
    this.setState({
      bids: _.assign({}, this.state.bids, bid),
      currentBidSnapshot: snapshot,
    });
  }
  handleBidSubmit(bid) {
    if (!this.bidsRef) {
      return alert('Database not available');
    }
    const snapshot = this.state.currentBidSnapshot;
    if (snapshot && !snapshot.val().Completed) {
      return snapshot.ref().set(bid);
    }
    return this.bidsRef.push(bid);
  }
  render() {
    const props = {
      bids: _.values(this.state.bids),
      currentBidSnapshot: this.state.currentBidSnapshot,
      handleBidSubmit: this.handleBidSubmit,
    };
    return (
      <this.props.SubpageContainer {...props} />
    );
  }
}

PageContainer.propTypes = {
  params: PropTypes.object.isRequired,
  // SubpageContainer: PropTypes.element.isRequired,
};

module.exports = PageContainer;

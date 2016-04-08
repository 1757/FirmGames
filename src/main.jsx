import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory } from 'react-router';

import PageContainer from 'src/containers/PageContainer';
import SinglePageContainer from 'src/containers/SinglePageContainer';
import SupplierPageContainer from 'src/containers/SupplierPageContainer';
import RetailerPageContainer from 'src/containers/RetailerPageContainer';
import JoinSession from 'src/components/JoinSession';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

// import WebFont from 'webfontloader';

// WebFont.load({
//   google: {
//     families: ['Roboto'],
//   },
// });

const PickGame = () => (
  <div className="container">
    <ul>
      <li><Link to={'/single'}>Single Player</Link></li>
      <li><Link to={'/multi/supplier/join'}>Multiplayer - Supplier</Link></li>
      <li><Link to={'/multi/retailer/join'}>Multiplayer - Retailer</Link></li>
    </ul>
  </div>
);

const RetailerPage = (props) => (
  <PageContainer {...props} SubpageContainer = {RetailerPageContainer} />
);

const SupplierPage = (props) => (
  <PageContainer {...props} SubpageContainer = {SupplierPageContainer} />
);

const router = (
  <Router history={browserHistory}>
    <Route path="/" component={PickGame} />
    <Route path="/single" component={SinglePageContainer} />
    <Route path="/multi">
      <Route path="supplier">
        <Route path="join" component={JoinSession} />
        <Route path="session/:sessionId" component={SupplierPage} />
      </Route>
      <Route path="retailer">
        <Route path="join" component={JoinSession} />
        <Route path="session/:sessionId" component={RetailerPage} />
      </Route>
    </Route>
  </Router>
);

ReactDOM.render(router, document.getElementById('react-main-mount'));

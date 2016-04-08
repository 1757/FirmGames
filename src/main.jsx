import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory } from 'react-router';

import SinglePageContainer from 'src/containers/SinglePageContainer';
import SupplierPageContainer from 'src/containers/SupplierPageContainer';
import RetailerPageContainer from 'src/containers/RetailerPageContainer';

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
      <li><Link to={'/multi/supplier'}>Multiplayer - Supplier</Link></li>
      <li><Link to={'/multi/retailer'}>Multiplayer - Retailer</Link></li>
    </ul>
  </div>
);

const router = (
  <Router history={browserHistory}>
    <Route path="/" component={PickGame} />
    <Route path="/single" component={SinglePageContainer} />
    <Route path="/multi">
      <Route path="supplier" component={SupplierPageContainer} />
      <Route path="retailer" component={RetailerPageContainer} />
    </Route>
  </Router>
);

ReactDOM.render(router, document.getElementById('react-main-mount'));

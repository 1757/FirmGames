import React, { PropTypes } from 'react';
import Griddle from 'griddle-react';
import Gameplay from './Gameplay';
// import SessionIdDialog from './SessionIdDialog';
// <SessionIdDialog {...dialogOptions} />
const Page = ({ sliderOptions, buttonOptions, bids }) => (
  <div className="container">
    <h1>The Game</h1>
    <Gameplay sliderOptions={sliderOptions} buttonOptions={buttonOptions} />
    <Griddle
      results={bids}
      showPager={false}
      useGriddleStyles={false}
      resultsPerPage={100}
      tableClassName="u-full-width"
      columns={[
        'Wholesale Price',
        'Quantity',
        'Demand',
        'Retailer Profit',
        'Supplier Profit',
      ]}
    />
  </div>
);

Page.propTypes = {
  // dialogOptions: PropTypes.object.isRequired,
  sliderOptions: PropTypes.object.isRequired,
  buttonOptions: PropTypes.object.isRequired,
  bids: PropTypes.array.isRequired,
};

module.exports = Page;

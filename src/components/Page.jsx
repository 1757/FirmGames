import React, { PropTypes } from 'react';
import Griddle from 'griddle-react';
import Gameplay from './Gameplay';
import SessionIdDialog from './SessionIdDialog';

const Page = ({ dialogOptions, sliderOptions, buttonOptions, bids }) => (
  <div className="container">
    <h1>The Game</h1>
    <SessionIdDialog {...dialogOptions} />
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
// <SessionIdDialog {...dialogOptions} />
Page.propTypes = {
  dialogOptions: PropTypes.object.isRequired,
  sliderOptions: PropTypes.object.isRequired,
  buttonOptions: PropTypes.object.isRequired,
  bids: PropTypes.array.isRequired,
};

module.exports = Page;

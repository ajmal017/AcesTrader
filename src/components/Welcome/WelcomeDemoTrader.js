// welcomeDemoTrader.js

import React from 'react'

const welcomeDemoTrader = () => {
  return (
    <div>
      <h2>Guest Mode - Simulated Trading</h2>
      <br />
      <p>
        Simulated trading is done using price data from the IEX stock exchange. Price data for charts is obtained from IEX data feeds. Order executions are filled when entered
        using the last price from IEX. IEX is a stock exchange based in the United States:
        <a href="https://en.wikipedia.org/wiki/IEX" target="_blank" rel="noopener noreferrer">
          &nbsp;See information here
        </a>
        .
      </p>
      <p>
        This guest mode has no interaction with any brokerage firm. Order executions are simulated using the IEX price data at the time of your order for fill prices. This means
        orders entered after the IEX close and before the next opening are filled using the last price and not the next opening price. The executed prices are not what would have
        been obtained from a brokerage execution, and the results are different than real trading.
      </p>
      <p>
        You have full access to the program's functions. Please understand that the program is still in a Beta test state. Some features are not fully programmed yet. For instance,
        changing the parameters of your orders is still a work in progress. Even though you can edit these, the edited values are not yet used. All entries are submitted as market
        day orders for a quantity costing $5,000. All exit orders are for all shares. This will change in the near future.
      </p>
      <p>
        You can create lists of prospective buys, prospective short sells, and prospective trend buys to watch. You can do simulated executions of order instructions to open and
        close trades. Your trading results are kept in a list of trades. These lists are kept in a local database and are available to you over subsequent logins from the same
        computer. So you can paper trade here over time to test your trading ideas.
      </p>
      <p>
        The guest mode has no access to cloud storage. The data for your lists are saved in the local storage of your browser. If you create your lists on your desktop computer,
        you won't be able to see the same data using the program on your iPad or iPhone. So make your lists in the browser and device you will use for your paper money trading
        sessions. You can of course, use another browser or device to persue a second trading strategy, without affecting the other.
      </p>
      <p>Click the AcesTrader menu title for more information.</p>
    </div>
  )
}
export default welcomeDemoTrader

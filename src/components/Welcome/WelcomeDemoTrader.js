// welcomeDemoTrader.js

import React from 'react'

const welcomeDemoTrader = () => {
  return (
    <div>
      <h2>GUEST MODE FOR PAPER MONEY TRADING</h2>
      <br />
      <p>
        You have full access to the program's functions. Please understand that the program is still in a Beta test state. Some features are not fully programmed yet. For instance,
        changing the parameters of your orders is still a work in progress. Even though you can edit these, the edited values are not yet used. All entries are submitted as market
        day orders for a quantity costing $5,000. All exit orders are for all shares. This will change in the near future.
      </p>
      <p>
        You can create lists of prospective buys and short sells to watch. You can do simulated executions of order instructions to open and close trades. Your trading results are
        kept in a list of trades. These lists are kept in a database and are available to you over subsequent logins. So you can paper trade here over time to test your trading
        ideas.
      </p>
      <p>
        This guest mode has no interaction with any brokerage firm. Price data for charts is obtained from the IEX stock exchange. Order executions are simulated using the IEX
        price data for fill prices. These prices are obtained at the time of you order, and they are the last price from the ticker feed. So after trading hours they are stale, but
        still good enough for the guest mode's simulated swing trading.
      </p>
      <p>
        There's another limitation to the guest mode. There is no access to cloud storage. The data for your lists are saved in the local storage of your browser. If you create
        your lists on your desktop computer, you won't be able to see the same data using the program on your iPad or iPhone. So make your lists in the browser and device you will
        use for your paper money trading sessions. You can of course, use another browser and device to persue a second trading strategy, without affecting the other.
      </p>
      <p>Click the AcesTrader menu title for more information.</p>
    </div>
  )
}
export default welcomeDemoTrader

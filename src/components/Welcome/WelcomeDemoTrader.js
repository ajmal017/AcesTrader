// welcomeDemoTrader.js

import React from 'react'

const welcomeDemoTrader = () => {
  return (
    <div>
      <h4>USING THE DEMO MODE</h4>
      <p>
        This Demo mode is provided as a guest SignIn option. You have full access to the program's functions. You can create lists of prospective buys and short sells to watch. You
        can do simulated executions of order instructions to open and close trades. Your trades are kept in a list of trades. These results are kept in a database and are available
        over subsequent logins. So you can paper trade here over days to test your trading and this facility.
      </p>
      <p>
        This Demo mode has no interaction with TDAmeritrade. Price data for charts is obtained from the IEX stock exchange. Order executions are simulated using the IEX price data
        for fill prices. These prices are obtained at the time of the order, and they are the last price from the ticker feed. So after trading hours they are stale, but still good
        enough for the demo's simulated swing trading.
      </p>
      <p>
        There's another limitation to the Demo mode. There is no access to the cloud storage. The data for your lists are saved in the local storage of your browser. If you create
        your lists on your desktop computer, you won't be able to see the same data using the program on your iPad. So make your lists in the browser and device you will use for
        demo trading sessions.
      </p>
      <p>See the About AcesTrader under the More menu for more information.</p>
    </div>
  )
}
export default welcomeDemoTrader

import React from 'react'
import './styles.css'

const HomeContent = function() {
  return (
    <div className='home-content'>
      <h4>ACESTRADER</h4>
      <p>
        <i>
          The AcesTrader program is a project by a retired coder, created as an easily managed system for end-of-day trading of stocks and ETFs using the API interface of
          TDAmeritrade's services. The program is still in development and is currently in a Beta state.
        </i>
      </p>
      <br />
      <h4>TRADE PROSPECTS</h4>
      <p>
        Two types of trading are envisioned: end-of-day trading and trend following. Three lists of prospective trade entries are available. For end-of-day trading there are a
        prospective buys list and a prospective short sales list. For trend following there is a prospective trend buys list. You use the Edits menu selection to change the list of
        symbols in each.
      </p>
      <p>
        For ETF end-of-day trading, lists of ETFs can be obtained from the monthly lists of "Buy on the Dip Prospects" and "Sell on the Pop Prospects" published in "The Daily ETF
        Roundup" by ETFdb.com. Each Buy on the Dip prospect is deemed to be in an uptrend, and each Sell on the Pop prospect is deemed to be in a downtrend. The long term trend is
        indicated by the 50-day moving average being above or below its 200-day moving average.{' '}
      </p>

      <p>
        For ETF trend trading, ETFs that follow diversified assets are used. Trending ETFs are traded by rebalancing monthly, buying when the ETF is priced above the 40-week moving
        average and selling when priced below the 40-week moving average. For a discussion of trading by trend following see{' '}
        <a href='https://extradash.com/en/strategies/models/5/faber-tactical-asset-allocation/' target='_blank' rel=' noopener noreferrer'>
          Faber-Tactical-Asset-Allocation.
        </a>{' '}
        An example list of ETFs tracking diversified asset classes is this: <br />
        SPY IWM EFA EEM VNQ TLT DBC GLD
        {/* IDV VNQI VEU VWO VTI VEA VIG VCSH VB DES VSS VGSH TIP DBC GLD */}
      </p>

      {/* <h5>Buy on the Dip Prospects</h5>
      <p>
        The ETFs from ETFdb.com that are included in this list are rated as buy candidates for two reasons. First, each of these funds is deemed to be in an uptrend based on the
        fact that its 50-day moving average is above its 200-day moving average, which are popular indicators for gauging long-term and medium-term trends, respectively.
        <br />
        Second, each of these ETFs is also trading below its five-day moving average, thereby offering a near-term ‘buy on the dip’ opportunity, given the longer-term uptrend at
        hand. Note that this prospects list also features a liquidity screen by excluding ETFs with average trading volumes below the one million shares mark.
      </p>
      <h5>Sell on the Pop Prospects</h5>
      <p>
        The ETFs from ETFdb.com that are included in this list are rated as sell candidates for two reasons. First, each of these funds is deemed to be in a downtrend based on the
        fact that its 50-day moving average is below its 200-day moving average, which are popular indicators for gauging long-term and medium-term trends, respectively.
        <br />
        Second, each of these ETFs is also trading above its five-day moving average, thereby offering a near-term ‘sell on the pop’ opportunity given the longer-term downtrend at
        hand. Note that this prospects list also features a liquidity screen by excluding ETFs with average trading volumes below the one million shares mark.{' '}
      </p>
      <h5>Buy on the Trend Prospects</h5>
      <p>
        For trend following, ETFs that follow diversified assets are used. For a discussion of trading by trend following see{' '}
        <a href="https://extradash.com/en/strategies/models/5/faber-tactical-asset-allocation/" target="_blank" rel=" noopener noreferrer">
          Faber-Tactical-Asset-Allocation
        </a>
      </p>
      <p>
        An example list of ETFs tracking asset classes is this: <br />
        IDV VNQI VEU VWO VTI VEA VIG VCSH VB DES VSS VGSH TIP DBC GLD
      </p> */}

      <h4>CHARTING TOOLS</h4>
      <p>
        Charts are created for each symbol and are arranged for inspection in three groups under Prospects: 'Buys, 'Short Sales, and Trend Buys. Also in three groups under
        Positions: 'Longs, 'Shorts, and Trend Longs. Each chart has an Edit button (pencil) to select different chart display options.
      </p>
      <p>
        Each chart has an associated dashboard with parameters initialized for the default order. The dashboard has an Edit button (pencil) to change some order parameters. A
        button allows the user to enter an order.
      </p>

      {/* <h4>TRADER ALERTS</h4>
      <p>
        An alert will be generated when the price chart shows an event such as crossing a trend line.
        A list of triggered alerts is available in the Alerts page. Each alert
        includes a link to the associated ETF chart page. The user can navigate there to inspect the chart and decide on an available dashboard action.
      </p>
 */}

      <h4>TRADER ACTIONS</h4>
      <p>
        The user has available trading options on the dashboard. These include placing an order to establish a position, either long or short depending on the security's grouping,
        or exiting any current position. The options also include removing the security from the prospects list. Note that orders are not placed automatically by the program, they
        are manually placed by the user clicking a button. The program tries to make the order procedure as frictionless as possible.
      </p>

      <h4>PLACING ORDERS</h4>
      <p>
        Please understand that the program is still in a Beta test state. At this time, orders are placed using the default parameters as shown in the dashboard. Even though you
        can edit these, the edited values are not yet used. All entries are submitted as market day orders for a quantity costing $5,000. All exit orders are for all shares. Work
        is in progress to enable the user to edit these default parameters. This will allow the user to customize the order before submitting.
        <br />
        <br />
        Note: The connection to TDAmeritrade's online trading interface is not done yet. Order executions are filled when entered using the last price from IEX. IEX is a stock
        exchange based in the United States:
        <a href='https://en.wikipedia.org/wiki/IEX' target='_blank' rel='noopener noreferrer'>
          &nbsp;See information here.
        </a>
        &nbsp; Clicking the BUY button only simulates an execution: the security record is removed from the Prospects list and placed in the Positions list. Also clicking the EXIT
        button only simulates the trade: the security record is removed from the Positions list and placed in the Trades list. The fill price for both orders is obtained from the
        IEX feed. But you can use the dashboard's edit button to edit the filled price, quantity, and execution date to modify the simulation data.
        {/* Trades are simulated using the IEX price data for execution prices. */}
        {/* <i>This work is not done yet and editing of any field is now allowed without validation. So don't mess up your edits.</i> */}
        {/* Users can always bypass this program and place orders directly using TDAmeritrade's services. */}
        <br />
        <br />
      </p>

      <h4>USING THE PROGRAM</h4>
      <p>
        Establish a watch list of potential trade securities in the three groups and check them periodically for signals according to your trading scheme. After you have
        established positions, check these charts to determine when to close a position following your trading approach. Completed trades are listed chronologically in the Trades
        menu. Be aware that the daily charts will not show the correct end-of-day price until after midnight, due to the after-market trading that occurs.
      </p>
      <p>
        You can click the More/Peek menu any time to see a color coded list showing a snapshot of the day's action including the last price for all your securities. After you click
        here, these current prices are carried over to the dashboard display of your charts to show the last price when you peeked and the difference from the price when you
        watched or when you entered a position. This information is also color coded according to the price difference.
      </p>

      <p>
        The program has some built in trading signals. In the Prospects list, any security using a weekly chart will have a orange BUY button when the closing price is above the 40
        week SMA. In the Positions list, any security using a weekly chart will have a orange EXIT button when the closing price is below the 40 week SMA. Also for the Positions
        list, all the securities have a default 5% trailing stop loss signal. At a price beyond the trailing stop's calculated price, the EXIT button will be colored red. The
        trailing stop's percent value for any security can be changed by clicking the dashboard's edit icon. The calculated stop loss price is displayed in the dashboard.
      </p>
      <h4>USING THE GUEST MODE</h4>
      <p>
        The program as designed can be used for live brokerage trading by only one person, using the assigned TDAmeritrade logon user name and password. However a Guest mode is
        provided as a guest sign in option for simulated trading. This mode has no interaction with TDAmeritrade. Price data for charts is obtained from the IEX stock exchange.
        Trades are simulated using the IEX price data for execution prices. These prices are obtained at the time of the order, and they are the last price from the ticker feed. So
        after trading hours they are stale, but still good enough for the guest mode simulated trading.
      </p>
      <p>
        There's another limitation to the Guest mode. There is no access to the cloud storage. The data for your lists are saved in the local storage of your browser. If you create
        your lists on your desktop computer, you won't be able to see the same data using the program on your iPad. So make your lists in the browser on the device you will use for
        the demo. On the other hand, this can be used to create different trading portfolios by using a different browser/device combination for each one. Each will have a separate
        database in a separate local storage.
      </p>
    </div>
  )
}
export default HomeContent

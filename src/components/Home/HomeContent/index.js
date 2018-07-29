import React from 'react'
import './styles.css'

const HomeContent = function() {
  return (
    <div className="home-content">
      <h4>ACESTRADER</h4>
      <p>
        <i>
          The AcesTrader program is hobby project by a retired coder, created as an experiment in an easily managed system for end-of-day trading of stocks and ETFs using the API
          interface of TDAmeritrade's services.
        </i>
      </p>
      <br />
      <h4>TRADE PROSPECTS</h4>
      <p>
        Two types of trading are envisioned: swing trading and trend following. Three lists of prospective trade entries are available. You use the Edit Lists menu selection to
        change the list of symbols in each. For swing trading there are a prospective buys list and a short sales list. For trend following there is a prospective buys list.
      </p>
      <p>
        For ETF swing trading, the lists of ETFs can be obtained from the weekly list of "Buy on the Dip Prospects" and "Sell on the Pop Prospects" published in "The Daily ETF
        Roundup" by ETFdb.com.
      </p>
      <h5>Buy on the Dip Prospects</h5>
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
      </p>

      <h4>CHARTING TOOLS</h4>
      <p>
        Charts are created for each ETF and are arranged for inspection in three groups under Prospects: Swing Buys, Swing Short Sales, and Trend Buys. Also in three groups under
        Positions: Swing Longs, Swing Shorts, and Trend Longs. Each chart has an associated dashboard with parameters initialized for the default order. A button allows the user to
        enter an order.
      </p>

      <h4>TRADER ALERTS</h4>
      <p>
        An alert will be generated when the price chart shows an event such as crossing a trend line.
        {/* These indicator lines are specified by the user with parameters in the chart's dashboard.  */}
        A list of triggered alerts is available in the Alerts page. Each alert includes a link to the associated ETF chart page. The user can navigate there to inspect the chart
        and decide on an available dashboard action.
      </p>

      <h4>TRADER ACTIONS</h4>
      <p>
        The user has available trading options on the dashboard. These include placing an order to establish a position, either long or short depending on the ETF's grouping, or
        exiting the current position. The user can ignore the alert and wait for another alert later. The options also include removing the ETF from the prospects list. Note that
        orders are not placed automatically by the program, they are manually placed if the user clicks a button.
      </p>

      <h4>PLACING ORDERS</h4>
      <p>
        Orders to enter or exit a position are placed by manual operation from the user. The program tries to make this manual procedure as frictionless as possible. Pressing an
        order button will present a form prefilled with default order instructions and a submit button. The user can submit as is, or customize before submitting. Regardless of any
        alert status, users can always place stop-loss orders or use profit-taking orders through the interface of TDAmeritrade's services..
      </p>
    </div>
  )
}
export default HomeContent

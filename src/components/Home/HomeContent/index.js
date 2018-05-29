import React from 'react'
import './styles.css'

const HomeContent = function() {
  return (
    <div className="home-content">
      <h4>THE PROSPECTS</h4>
      <p>
        The lists of ETFs used in AcesTrader are obtained from the weekly list of "Buy on the Dip Prospects" and "Sell on the Pop Prospects" published in "The Daily ETF Roundup" by
        ETFdb.com.
        <br />
        <h4>Buy on the Dip Prospects</h4>
        The ETFs included in this list are rated as buy candidates for two reasons. First, each of these funds is deemed to be in an uptrend based on the fact that its 50-day
        moving average is above its 200-day moving average, which are popular indicators for gauging long-term and medium-term trends, respectively.
        <br />
        Second, each of these ETFs is also trading below its five-day moving average, thereby offering a near-term ‘buy on the dip’ opportunity, given the longer-term uptrend at
        hand. Note that this prospects list also features a liquidity screen by excluding ETFs with average trading volumes below the one million shares mark.
        <br />
        <h4>Sell on the Pop Prospects</h4>
        The ETFs included in this list are rated as sell candidates for two reasons. First, each of these funds is deemed to be in a downtrend based on the fact that its 50-day
        moving average is below its 200-day moving average, which are popular indicators for gauging long-term and medium-term trends, respectively.
        <br />
        Second, each of these ETFs is also trading above its five-day moving average, thereby offering a near-term ‘sell on the pop’ opportunity given the longer-term downtrend at
        hand. Note that this prospects list also features a liquidity screen by excluding ETFs with average trading volumes below the one million shares mark.{' '}
      </p>

      <h4>THE CHARTING TOOLS</h4>
      <p>
        Charts are created for each ETF and are arranged for inspection in four groups: Buy Prospects, Sell Prospects, Long Positions, and Short Positions. Each chart has an
        associated dashboard with parameters adjustable by the user. The parameters specify indicators to be added to the price chart. The parameters control the alerts signaled by
        the program based on the chart data.
      </p>

      <h4>TRADER ALERTS</h4>
      <p>
        An alert will be generated when the price chart shows an event such as crossing a trend line, a line of resistance, or support line. These indicator lines are specified by
        the user with parameters in the chart's dashboard. A list of triggered alerts is available in the Alerts page. Each alert includes a link to the associated ETF chart page.
        The user can go there to inspect the chart and decided on an available dashboard action.
      </p>

      <h4>TRADER ACTIONS</h4>
      <p>
        The user has available trading options on the dashboard. These include entering an order to establish a position, either long or short depending on the ETF's grouping, or
        exiting the current position. The user can ignore the alert and adjust the chart indicators to wait for another alert later. The options also include removing the ETF from
        the prospects list. Note that orders are not entered automatically by the program, they are manually entered at the discretion of the user.
      </p>

      <h4>ENTERING ORDERS</h4>
      <p>
        Orders to enter or exit a position are entered by manual operation from the user. The program tries to make this manual procedure as frictionless as possible. Pressing an
        order button will present a form prefilled with default order instructions and a submit button. The user can submit as is, or customize before submitting. Regardless of any
        alert status, users can always enter stop-loss orders and use profit-taking orders.
      </p>
    </div>
  )
}
export default HomeContent

// Managelists/index.js

// http://stockcharts.com/h-sc/ui?s=msft

import React, { Component } from 'react'
// import { connect } from 'react-redux'
// import { managelistitems } from '../../redux/ducksListitems'
import BetaNotice from '../BetaNotice'
// import './styles.css'

class Managelists extends Component {
  componentDidMount() {
    window.scrollTo(0, 0)
  }

  render() {
    const myFunction = () => {
      var output, filter, table, tr, td, link, i
      var symbols = []
      // output = document.getElementById("myTextArea");
      //   filter = input.value.toUpperCase();
      // table = document.getElementById("myTable");
      table = document.getElementByTagName('table')[0]
      tr = table.getElementsByTagName('tr')
      for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName('td')[0]
        if (td) {
          link = td.getElementsByTagName('a')[0]
          symbols.push(link.innerHTML)
        }
      }
      output = symbols.join(',')
    }

    return (
      <div>
        <textarea id="myTextArea" />

        <h2>Buy on the dip</h2>
        <p>
          <table class="table mm-mobile-table" id="myTable">
            <thead>
              <tr>
                <th>Ticker</th>
                <th>Name</th>
                <th>Price</th>
                <th>1-Year Return</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td data-th="Ticker">
                  (
                  <a href="/etf/TQQQ/">TQQQ</a>
                  <span class="rating-circle">B</span>)
                </td>
                <td data-th="Name">Ultrapro QQQ Proshares</td>
                <td data-th="Price">$162.95</td>
                <td data-th="1-Year Return">71.20%</td>
              </tr>
              <tr>
                <td data-th="Ticker">
                  (
                  <a href="/etf/UDOW/">UDOW</a>
                  <span class="rating-circle">B+</span>)
                </td>
                <td data-th="Name">Ultrapro DOW 30 Proshares</td>
                <td data-th="Price">$90.14</td>
                <td data-th="1-Year Return">66.28%</td>
              </tr>
              <tr>
                <td data-th="Ticker">
                  (
                  <a href="/etf/UPRO/">UPRO</a>
                  <span class="rating-circle">B+</span>)
                </td>
                <td data-th="Name">Ultrapro S&amp;P 500 Proshares</td>
                <td data-th="Price">$141.44</td>
                <td data-th="1-Year Return">47.93%</td>
              </tr>
              <tr>
                <td data-th="Ticker">
                  (
                  <a href="/etf/QLD/">QLD</a>
                  <span class="rating-circle">A</span>)
                </td>
                <td data-th="Name">Ultra QQQ Proshares</td>
                <td data-th="Price">$83.36</td>
                <td data-th="1-Year Return">47.67%</td>
              </tr>
              <tr>
                <td data-th="Ticker">
                  (
                  <a href="/etf/SPXL/">SPXL</a>
                  <span class="rating-circle">B+</span>)
                </td>
                <td data-th="Name">Direxion S&amp;P 500 Bull 3X</td>
                <td data-th="Price">$44.65</td>
                <td data-th="1-Year Return">42.02%</td>
              </tr>
              <tr>
                <td data-th="Ticker">
                  (
                  <a href="/etf/MCHI/">MCHI</a>
                  <span class="rating-circle">A</span>)
                </td>
                <td data-th="Name">China Ishares MSCI ETF</td>
                <td data-th="Price">$69.49</td>
                <td data-th="1-Year Return">32.69%</td>
              </tr>
              <tr>
                <td data-th="Ticker">
                  (
                  <a href="/etf/SSO/">SSO</a>
                  <span class="rating-circle">A</span>)
                </td>
                <td data-th="Name">Ultra S&amp;P 500 Proshares</td>
                <td data-th="Price">$111.61</td>
                <td data-th="1-Year Return">31.86%</td>
              </tr>
              <tr>
                <td data-th="Ticker">
                  (
                  <a href="/etf/MTUM/">MTUM</a>
                  <span class="rating-circle">A-</span>)
                </td>
                <td data-th="Name">USA Momentum Factor Ishares Edge MSCI ETF</td>
                <td data-th="Price">$110.59</td>
                <td data-th="1-Year Return">29.77%</td>
              </tr>
              <tr>
                <td data-th="Ticker">
                  (
                  <a href="/etf/XLK/">XLK</a>
                  <span class="rating-circle">A</span>)
                </td>
                <td data-th="Name">S&amp;P 500 Info Tech Sector SPDR</td>
                <td data-th="Price">$69.16</td>
                <td data-th="1-Year Return">26.67%</td>
              </tr>
              <tr>
                <td data-th="Ticker">
                  (
                  <a href="/etf/QQQ/">QQQ</a>
                  <span class="rating-circle">A-</span>)
                </td>
                <td data-th="Name">Nasdaq QQQ ETF</td>
                <td data-th="Price">$168.33</td>
                <td data-th="1-Year Return">23.71%</td>
              </tr>
              <tr>
                <td data-th="Ticker">
                  (
                  <a href="/etf/FXI/">FXI</a>
                  <span class="rating-circle">A-</span>)
                </td>
                <td data-th="Name">China Large-Cap Ishares ETF</td>
                <td data-th="Price">$47.79</td>
                <td data-th="1-Year Return">22.79%</td>
              </tr>
              <tr>
                <td data-th="Ticker">
                  (
                  <a href="/etf/IWF/">IWF</a>
                  <span class="rating-circle">A+</span>)
                </td>
                <td data-th="Name">Russell 1000 Growth Ishares ETF</td>
                <td data-th="Price">$141.60</td>
                <td data-th="1-Year Return">22.42%</td>
              </tr>
              <tr>
                <td data-th="Ticker">
                  (
                  <a href="/etf/XLF/">XLF</a>
                  <span class="rating-circle">A</span>)
                </td>
                <td data-th="Name">S&amp;P 500 Financials Sector SPDR</td>
                <td data-th="Price">$28.18</td>
                <td data-th="1-Year Return">22.20%</td>
              </tr>
              <tr>
                <td data-th="Ticker">
                  (
                  <a href="/etf/SPYG/">SPYG</a>
                  <span class="rating-circle">A-</span>)
                </td>
                <td data-th="Name">SPDR S&amp;P 500 Growth Portfolio ETF</td>
                <td data-th="Price">$34.82</td>
                <td data-th="1-Year Return">20.67%</td>
              </tr>
              <tr>
                <td data-th="Ticker">
                  (
                  <a href="/etf/DIA/">DIA</a>
                  <span class="rating-circle">A-</span>)
                </td>
                <td data-th="Name">DOW Industrials SPDR</td>
                <td data-th="Price">$247.74</td>
                <td data-th="1-Year Return">19.99%</td>
              </tr>
              <tr>
                <td data-th="Ticker">
                  (
                  <a href="/etf/EWJ/">EWJ</a>
                  <span class="rating-circle">A</span>)
                </td>
                <td data-th="Name">Japan Ishares MSCI ETF</td>
                <td data-th="Price">$61.16</td>
                <td data-th="1-Year Return">16.54%</td>
              </tr>
              <tr>
                <td data-th="Ticker">
                  (
                  <a href="/etf/EWI/">EWI</a>
                  <span class="rating-circle">B-</span>)
                </td>
                <td data-th="Name">Italy Ishares MSCI ETF</td>
                <td data-th="Price">$32.40</td>
                <td data-th="1-Year Return">16.17%</td>
              </tr>
              <tr>
                <td data-th="Ticker">
                  (
                  <a href="/etf/EWS/">EWS</a>
                  <span class="rating-circle">B+</span>)
                </td>
                <td data-th="Name">Singapore Ishares MSCI ETF</td>
                <td data-th="Price">$27.21</td>
                <td data-th="1-Year Return">15.84%</td>
              </tr>
              <tr>
                <td data-th="Ticker">
                  (
                  <a href="/etf/IVV/">IVV</a>
                  <span class="rating-circle">A</span>)
                </td>
                <td data-th="Name">S&amp;P 500 Ishares Core ETF</td>
                <td data-th="Price">$273.88</td>
                <td data-th="1-Year Return">15.40%</td>
              </tr>
              <tr>
                <td data-th="Ticker">
                  (
                  <a href="/etf/VOO/">VOO</a>
                  <span class="rating-circle">A</span>)
                </td>
                <td data-th="Name">S&amp;P 500 ETF Vanguard</td>
                <td data-th="Price">$249.88</td>
                <td data-th="1-Year Return">15.38%</td>
              </tr>
              <tr>
                <td data-th="Ticker">
                  (
                  <a href="/etf/SPY/">SPY</a>
                  <span class="rating-circle">A</span>)
                </td>
                <td data-th="Name">S&amp;P 500 SPDR</td>
                <td data-th="Price">$272.01</td>
                <td data-th="1-Year Return">15.35%</td>
              </tr>
              <tr>
                <td data-th="Ticker">
                  (
                  <a href="/etf/ACWI/">ACWI</a>
                  <span class="rating-circle">A</span>)
                </td>
                <td data-th="Name">ACWI Ishares MSCI ETF</td>
                <td data-th="Price">$73.40</td>
                <td data-th="1-Year Return">13.80%</td>
              </tr>
              <tr>
                <td data-th="Ticker">
                  (
                  <a href="/etf/VT/">VT</a>
                  <span class="rating-circle">A+</span>)
                </td>
                <td data-th="Name">Total World Stock Index ETF Vanguard</td>
                <td data-th="Price">$75.43</td>
                <td data-th="1-Year Return">13.58%</td>
              </tr>
              <tr>
                <td data-th="Ticker">
                  (
                  <a href="/etf/EWH/">EWH</a>
                  <span class="rating-circle">A</span>)
                </td>
                <td data-th="Name">Hong Kong Ishares MSCI ETF</td>
                <td data-th="Price">$25.89</td>
                <td data-th="1-Year Return">11.84%</td>
              </tr>
              <tr>
                <td data-th="Ticker">
                  (
                  <a href="/etf/IEFA/">IEFA</a>
                  <span class="rating-circle">A+</span>)
                </td>
                <td data-th="Name">EAFE Ishares Core MSCI ETF</td>
                <td data-th="Price">$67.50</td>
                <td data-th="1-Year Return">11.04%</td>
              </tr>
              <tr>
                <td data-th="Ticker">
                  (
                  <a href="/etf/SCHF/">SCHF</a>
                  <span class="rating-circle">A</span>)
                </td>
                <td data-th="Name">Schwab Intl Equity ETF</td>
                <td data-th="Price">$34.56</td>
                <td data-th="1-Year Return">11.02%</td>
              </tr>
              <tr>
                <td data-th="Ticker">
                  (
                  <a href="/etf/VEU/">VEU</a>
                  <span class="rating-circle">A</span>)
                </td>
                <td data-th="Name">FTSE All-World Ex-US ETF Vanguard</td>
                <td data-th="Price">$55.08</td>
                <td data-th="1-Year Return">10.69%</td>
              </tr>
              <tr>
                <td data-th="Ticker">
                  (
                  <a href="/etf/EFA/">EFA</a>
                  <span class="rating-circle">A</span>)
                </td>
                <td data-th="Name">EAFE Ishares MSCI ETF</td>
                <td data-th="Price">$71.59</td>
                <td data-th="1-Year Return">9.73%</td>
              </tr>
              <tr>
                <td data-th="Ticker">
                  (
                  <a href="/etf/CWB/">CWB</a>
                  <span class="rating-circle">B+</span>)
                </td>
                <td data-th="Name">Convertible Secs Barclays Capital SPDR</td>
                <td data-th="Price">$52.91</td>
                <td data-th="1-Year Return">9.50%</td>
              </tr>
              <tr>
                <td data-th="Ticker">
                  (
                  <a href="/etf/EZU/">EZU</a>
                  <span class="rating-circle">A-</span>)
                </td>
                <td data-th="Name">Eurozone Ishares MSCI ETF</td>
                <td data-th="Price">$44.50</td>
                <td data-th="1-Year Return">9.44%</td>
              </tr>
              <tr>
                <td data-th="Ticker">
                  (
                  <a href="/etf/USMV/">USMV</a>
                  <span class="rating-circle">A</span>)
                </td>
                <td data-th="Name">USA Min Vol Ishares Edge MSCI ETF</td>
                <td data-th="Price">$52.31</td>
                <td data-th="1-Year Return">9.14%</td>
              </tr>
              <tr>
                <td data-th="Ticker">
                  (
                  <a href="/etf/EFV/">EFV</a>
                  <span class="rating-circle">A-</span>)
                </td>
                <td data-th="Name">EAFE Value Ishares MSCI ETF</td>
                <td data-th="Price">$55.98</td>
                <td data-th="1-Year Return">7.16%</td>
              </tr>
            </tbody>
          </table>
        </p>
      </div>
    )
  }
}
export default Managelists

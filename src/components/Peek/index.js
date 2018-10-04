// Peek/index.js
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { resetPeekPrices, putPeekPrice, finishPeekPrices } from '../../lib/appLastPeekPrice'
import './styles.css'

//This code taken from https://github.com/toddwschneider/stocks
//Thanks Todd! See: http://toddwschneider.com/

class Peek extends Component {
  constructor(props) {
    super(props)
    this.containerDiv = null
    this.updatedDiv = null
    this.portfolioDiv = null
    this.state = { mounted: false }
  }

  componentDidMount() {
    window.scrollTo(0, 0)
    this.containerDiv = document.querySelector('.stocks-container')
    this.updatedDiv = document.querySelector('.updated-timestamp')
    this.setState({ mounted: true })
  }

  render() {
    const buysSymbols = this.props.state.buys.map((obj) => obj.symbol)
    const sellsSymbols = this.props.state.sells.map((obj) => obj.symbol)
    const longsSymbols = this.props.state.longs.map((obj) => obj.symbol)
    const shortsSymbols = this.props.state.shorts.map((obj) => obj.symbol)
    const trendbuysSymbols = this.props.state.trendbuys.map((obj) => obj.symbol)
    const trendlongsSymbols = this.props.state.trendlongs.map((obj) => obj.symbol)

    const DEFAULT_PORTFOLIOS = [
      { name: 'Swing Buy Prospects', symbols: [...buysSymbols] },
      { name: 'Swing Long Positions', symbols: [...longsSymbols] },
      { name: 'Swing Short Sale Prospects', symbols: [...sellsSymbols] },
      { name: 'Swing Short Positions', symbols: [...shortsSymbols] },
      { name: 'Trend Buy Prospects', symbols: [...trendbuysSymbols] },
      { name: 'Trend Long Positions', symbols: [...trendlongsSymbols] },
      { name: 'Market ETFs', symbols: ['SPY', 'QQQ', 'IWM', 'DIA'] },
      // { name: 'Tech', symbols: ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'FB', 'TWTR', 'NFLX', 'SNAP', 'SPOT', 'DBX', 'BABA', 'INTC', 'AMD', 'NVDA', 'ORCL'] },
      // { name: 'Sector ETFs', symbols: ['XLF', 'XLK', 'XLV', 'XLP', 'XLY', 'XLE', 'XLB', 'XLI', 'XLU', 'XLRE'] },
      // { name: 'Banks', symbols: ['GS', 'MS', 'JPM', 'WFC', 'C', 'BAC', 'BCS', 'DB', 'CS', 'RBS'] },
      // { name: 'Bond ETFs', symbols: ['BND', 'BIV', 'JNK'] },
      // { name: 'Other ETFs', symbols: ['VOO', 'VTI', 'VGK', 'VPL', 'VWO', 'VDE', 'XOP', 'VFH', 'VHT', 'VIG', 'VYM', 'VAW', 'REM', 'XHB', 'GLD'] },
      // { name: 'Mortgage REITs', symbols: ['EFC', 'EARN', 'NLY', 'AGNC', 'CIM', 'TWO', 'NRZ'] },
      // { name: 'Autos', symbols: ['F', 'GM', 'FCAU', 'TM', 'HMC', 'TSLA'] },
    ]
    const PORTFOLIOS = DEFAULT_PORTFOLIOS
    // const REFRESH_SECONDS = 10
    const BATCH_SIZE = 100
    const BASE_URL = 'https://api.iextrading.com/1.0/stock/market/batch'

    if (this.state.mounted) {
      let symbols = []
      PORTFOLIOS.forEach((p, i) => addPortfolio(p, i === 0, this.containerDiv))
      symbols = symbols.filter((s, i) => symbols.indexOf(s) === i)
      updateData('addTitle', this.updatedDiv)
      // setInterval(updateData, REFRESH_SECONDS * 1000)
      function addPortfolio(portfolio, includeHeader, theContainerDiv) {
        let tableHeaderHtml = ''
        if (includeHeader || true) {
          tableHeaderHtml = `
        <thead>
          <tr>
            <th></th>
            <th class="stock-price">Last</th>
            <th class="stock-change">Change</th>
            <th class="stock-change-pct">Change%</th>
            <th class="stock-mkt-cap">Mkt Cap</th>
          </tr>
        </thead>
      `
        }
        let tableBodyHtml = portfolio.symbols
          .map((symbol) => {
            symbol = symbol.toUpperCase()
            symbols.push(symbol)
            let html = `
        <tr data-symbol="${symbol}">
          <td class="stock-symbol">${symbol}</td>
          <td class="stock-price"></td>
          <td class="stock-change"></td>
          <td class="stock-change-pct"></td>
          <td class="stock-mkt-cap"></td>
        </tr>
      `
            return html
          })
          .join('')
        let portfolioDiv = document.createElement('div')
        // thePortfolioDiv.innerHTML = `
        portfolioDiv.innerHTML = `
      <details open>
        <summary><h3>${portfolio.name}</h3></summary>
        <table>${tableHeaderHtml}<tbody>${tableBodyHtml}</tbody></table>
      </details>
    `
        theContainerDiv.appendChild(portfolioDiv)
      }

      function updateData(addTitle, theUpdatedDiv) {
        let numberOfBatches = Math.ceil(symbols.length / BATCH_SIZE)
        for (let i = 0; i < numberOfBatches; i++) {
          let symbolsBatch = symbols.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE)
          updateDataForBatch(symbolsBatch, addTitle)
        }
        theUpdatedDiv.innerHTML = `Data updated at ${new Date().toLocaleString()}`
      }
      function updateDataForBatch(symbols, addTitle) {
        resetPeekPrices() //reset the list of prices for use in Charts dashboards
        let filters = ['latestPrice', 'change', 'changePercent', 'marketCap']
        if (addTitle) filters.push('companyName')
        let url = `${BASE_URL}?types=quote&symbols=${symbols.join(',')}&filter=${filters.join(',')}`
        fetch(url)
          .then((response) => response.json())
          .then((json) => {
            symbols.forEach((symbol) => {
              let data = json[symbol]
              if (typeof data === 'undefined') return
              let formattedPrice = formatQuote(data.quote.latestPrice)
              let formattedChange = data.quote.change.toLocaleString('en', { minimumFractionDigits: 2 })
              let formattedChangePercent = (data.quote.changePercent * 100).toFixed(1) + '%'
              let formattedMarketCap = formatMarketCap(data.quote.marketCap)
              let rgbColor = data.quote.changePercent > 0 ? '0,255,0' : '255,0,0'
              let rgbOpacity = Math.min(Math.abs(data.quote.changePercent) * 20, 1)
              putPeekPrice(symbol, data.quote.latestPrice) //save in the list of prices for use in Charts dashboards
              document.querySelectorAll(`[data-symbol="${symbol}"] .stock-price`).forEach((e) => {
                e.innerHTML = formattedPrice
                e.setAttribute('style', `background-color: rgba(${rgbColor}, ${rgbOpacity})`)
              })
              document.querySelectorAll(`[data-symbol="${symbol}"] .stock-change`).forEach((e) => {
                e.innerHTML = formattedChange
                e.setAttribute('style', `background-color: rgba(${rgbColor}, ${rgbOpacity})`)
              })
              document.querySelectorAll(`[data-symbol="${symbol}"] .stock-change-pct`).forEach((e) => {
                e.innerHTML = formattedChangePercent
                e.setAttribute('style', `background-color: rgba(${rgbColor}, ${rgbOpacity})`)
              })
              document.querySelectorAll(`[data-symbol="${symbol}"] .stock-mkt-cap`).forEach((e) => {
                e.innerHTML = formattedMarketCap
                e.setAttribute('style', `background-color: rgba(${rgbColor}, ${rgbOpacity})`)
              })
              if (addTitle) {
                document.querySelectorAll(`[data-symbol="${symbol}"] .stock-symbol a`).forEach((e) => {
                  e.setAttribute('title', data.quote.companyName)
                })
              }
            })
            finishPeekPrices() //this is the complete list of prices for use in Charts dashboards
          })
      }
      // function portfoliosFromQueryParams() {
      //   if (!window.location.search) return
      //   let params = new URLSearchParams(window.location.search)
      //   let portfolios = []
      //   for (let p of params) {
      //     portfolios.push({ name: p[0], symbols: p[1].split(',') })
      //   }
      //   return portfolios
      // }
      // function symbolUrl(symbol) {
      //   return `https://iextrading.com/apps/stocks/#/${symbol}`
      // }
      function formatQuote(value) {
        let options = {
          minimumFractionDigits: 2,
          style: 'currency',
          currency: 'USD',
        }
        return value.toLocaleString('en', options)
      }
      function formatMarketCap(marketCap) {
        let value, suffix
        if (marketCap >= 1e12) {
          value = marketCap / 1e12
          suffix = 'T'
        } else if (marketCap >= 1e9) {
          value = marketCap / 1e9
          suffix = 'B'
        } else {
          value = marketCap / 1e6
          suffix = 'M'
        }
        let digits = value < 10 ? 1 : 0
        return '$' + value.toFixed(digits) + suffix
      }
    }
    return (
      <div className="pagebody">
        <div className="stocks-container" />

        <p className="updated-timestamp" />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  state: state,
  // buys: state.buys,
  // sells: state.sells,
  // longs: state.longs,
  // shorts: state.shorts,
})

export default connect(mapStateToProps)(Peek)

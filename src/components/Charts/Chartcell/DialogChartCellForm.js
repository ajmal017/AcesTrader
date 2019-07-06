// Chartcell/DialogChartCellForm.js

import React, { Component } from 'react'
import dialogPolyfill from 'dialog-polyfill'
// import { getChartFlags } from '../../../lib/chartDataCache'
import './stylesDialogChartCellForm.css'

class DialogChartCellForm extends Component {
  constructor(props) {
    super(props)
    this.handleEditChartParamsDialog = this.handleEditChartParamsDialog.bind(this)
    this.handleRadioChange = this.handleRadioChange.bind(this)
    this.DialogChartCellFormParams = null
    this.state = {}
  }

  componentDidMount() {
    this.DialogChartCellFormParams = document.getElementById('chart-params' + this.hash)
    dialogPolyfill.registerDialog(this.DialogChartCellFormParams) // Now dialog acts like a native <dialog>.
    document.body.appendChild(this.DialogChartCellFormParams)
  }
  componentWillUnmount() {
    document.body.removeChild(this.DialogChartCellFormParams)
  }

  handleEditChartParamsDialog(event) {
    // Reset the state of dialog's values, using the current props, to replace left-over values from a canceled updated
    let weeklyBars = this.props.cellObject.weeklyBars ? true : false
    let macdChart = this.props.cellObject.macdChart ? true : false
    this.setState({ weeklyBars: weeklyBars, macdChart: macdChart })
    this.DialogChartCellFormParams.showModal()
    this.DialogChartCellFormParams.addEventListener('close', (event) => {
      if (this.DialogChartCellFormParams.returnValue === 'yes') {
        // Note that this.State has been updated by handleRadioChange() calls from the <dialog/> element
        let parameterData = { weeklyBars: this.state.weeklyBars, macdChart: this.state.macdChart }
        this.props.handleDispatchOfDialogEdit(parameterData)
      }
    })
    this.DialogChartCellFormParams.addEventListener('cancel', function (event) {
      event.preventDefault() // disables using the Esc button to close
    })
  }

  handleRadioChange(event) {
    const value = event.target.value
    if (value === 'daily') this.setState({ weeklyBars: false })
    if (value === 'weekly') this.setState({ weeklyBars: true })
    if (value === 'ma') this.setState({ macdChart: false })
    if (value === 'macd') this.setState({ macdChart: true })
  }

  render() {
    const MINIMUMWEEKLYBARS = 3// NOTE this magic number is defined in 2 locations, keep in sync
    const cellObject = this.props.cellObject
    const weeklyBarCount = this.props.weeklyBarCount

    const chartSeries = (weeklyBarCount < MINIMUMWEEKLYBARS) ? 'Daily Bars' : this.props.cellObject.weeklyBars ? 'Weekly Bars' : 'Daily Bars'

    this.symbol = cellObject.symbol
    // const chartFlags = getChartFlags(this.symbol) //  { validShortSma: x, validLongSma: y, weeklyBarCount: z }
    this.tradeSide = cellObject.dashboard.tradeSide
    const chart_name = cellObject.symbol
    this.hash = cellObject.hash
    let tradeDesc = null
    if ('Buys' === this.tradeSide) {
      tradeDesc = 'Buy Long -'
    } else if ('Short Sales' === this.tradeSide) {
      tradeDesc = 'Sell Short -'
    } else if ('Trend Buys' === this.tradeSide) {
      tradeDesc = 'Buy Trend -'
    } else if ('Longs' === this.tradeSide) {
      tradeDesc = 'Long Position -'
    } else if ('Shorts' === this.tradeSide) {
      tradeDesc = 'Short Position -'
    } else if ('Trend Longs' === this.tradeSide) {
      tradeDesc = 'Trend Position -'
    }

    return (
      <div>
        <dialog id={'chart-params' + this.hash} className={'chart-dialog-form'}>
          <span className={'edit-symbol'}> {this.symbol} - Make Your Changes Below.</span>
          <br />
          <br />
          <form method='dialog'>
            <div className='chart-radio-grid'>

              {weeklyBarCount >= MINIMUMWEEKLYBARS ? (
                <>
                  <input className='buttonDaily' type='radio' value='daily' name='seriesBars' onChange={this.handleRadioChange} checked={this.state.weeklyBars !== true} />
                  <span className='labelDaily'>Daily Bars</span>
                  <input className='buttonWeekly' type='radio' value='weekly' name='seriesBars' onChange={this.handleRadioChange} checked={this.state.weeklyBars === true} />
                  <span className='labelWeekly'>Weekly Bars</span>
                </>) :
                <span>Weekly chart too small.</span>
              }

              <input className='buttonMA' type='radio' value='ma' name='indicators' onChange={this.handleRadioChange} checked={this.state.macdChart !== true} />
              <span className='labelMA'>With MA</span>
              <input className='buttonMACD' type='radio' value='macd' name='indicators' onChange={this.handleRadioChange} checked={this.state.macdChart === true} />
              <span className='labelMACD'>With MACD</span>
            </div>
            <br />
            <br />
            <span className={'dialog-button-row'}>
              <button className={'dialog-button'} type='submit' value='no'>
                Cancel
              </button>
              &nbsp; &nbsp; &nbsp; &nbsp;
              <button className={'dialog-button'} type='submit' value='yes'>
                Save
              </button>
            </span>
          </form>
        </dialog>
        <div className='graph-header'>
          <span className='trade-desc'>{tradeDesc}</span>
          <span className='cell-title'>{chart_name}</span>

          <span className='chart-series-label'>{chartSeries}</span>
          {/* <span className='chart-series-label'>{this.props.cellObject.weeklyBars ? 'Weekly Bars' : 'Daily Bars'}</span> */}
          <span className='chart-indicator-label'>{this.props.cellObject.macdChart ? 'With MACD' : 'With MA'}</span>

          <button onClick={this.handleEditChartParamsDialog} className={'chart-edit-button'}>
            <img
              alt=''
              src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACOSURBVDhP1ZDBCYQwFAWzF2FtQbAMYT1pZXraKjzK3rcBrcI+7EDnRXMR1hgPKw4M8oT38xPzbzJ8Y2RTICmOOOEXg4Yk67dGDZDa5BAv1MmVTcsQZV3Hiyu7U90Qt9Eu27JU1lt4+VXWfy85XlMWT/zgqXKBD9QjtaiyNjpMjw1qSIxBZTFgh6VNN8GYGaGaLE+Bi37NAAAAAElFTkSuQmCC'
            />
          </button>
        </div>
      </div>
    )
  }
}
export default DialogChartCellForm

// appStateMachine.js

import { getDailyPriceChart } from './appGetDailyPriceChart'
import { putEquityChart } from './chartDataCache'
import { getSmaTradingData } from './chartDataCache'
import { setStaleCharts } from './chartDataCache'
import { putTradeMarker, putLegendItem } from './chartDataCache'

// Stop codes returned from TrailingSellStops()
const ts1 = 'Early ma cross exit'
const ts2 = 'Immediate exit'
const ts6 = 'Revert to cash'
// Stop codes returned from TrailingBuyStops()
const ts3 = 'Revert to long'
const ts4 = 'Early ma cross entry'
const ts5 = 'Immediate entry'

// State codes
const LongAbove = 'Long>SMA'
const CashAbove = 'Cash>SMA'
const LongBelow = 'Long<SMA'
const CashBelow = 'Cash<SMA'

// Action codes
const LongAboveLater = 'Buy above ma at interval end'
const LongAboveNow = 'Buy above ma now, skipping interval period'
const LongAboveRevert = 'Buy above ma now, reverting panic sell'

const CashBelowLater = 'Sell below ma at interval end'
const CashBelowNow = 'Sell below ma now, skipping interval period'
const CashBelowRevert = 'Sell below ma now, reverting urgent buy'

const LongBelowNow = 'Urgent Buy below ma cross'
const CashAboveNow = 'Urgent Sell above ma cross'

const startValue = 10000 // all symbol positions are funded the same

let state
let symbol
let closeOnly
let sellStopBasis
let buyStopBasis
let currentState
let nextState
let dayCounter
let positionSize // share quantity of the long position
let yesterday //last action day; month day (from 1-31) or week day (from 0-6)
let positionValue // can be the cash value, else yesterday's market value at the close
let markers = []
let legends = []

export const stateMachine = (theState, theSymbol) => {
  state = theState // make state available to all functions
  symbol = theSymbol // make symbol available to all functions
  closeOnly = theState.CLOSEONLY // make closeOnly value available to all functions
  let positionValues = [] // start new array [{ date: date, value: positionValue }...]
  putTradeMarker(symbol, []) // clear this cache
  markers = []
  legends = []

  const sma = getSmaTradingData(symbol) // get sma for symbol as calculated per the dashboard spec.
  const data = getDailyPriceChart(symbol) // get a dailyPriceChart with starting date to match first SMA data available  for testing the daily trading

  if (state.BH) {
    // run as Buy & Hold, no trading done, portfolio value is equal to a position of one share
    putEquityChart(symbol, data) // rawEquityChart data array
    setStaleCharts(false)
    return { positionValues: data, nextState: null }//data is the finished positionValues array
  }

  // record the daily positionValue at the close and get a trading signal based on the close
  for (let j = 0; j < data.length; j++) {
    // get each day's items
    const date = data[j].date
    const close = data[j].close
    const ma = sma[j].close
    const open = closeOnly ? close : data[j].open // modified 4/18/2018 to accommodate IEX pricing options
    let basis = closeOnly ? close : open // modified 4/18/2018 to accommodate IEX pricing options
    // debugger
    if (j === 0) {
      // In this case, the CurrenAction is predetermined for the initial day, a nextState is not used
      // Set initial positionValue and stateMachine's currentState
      positionSize = startValue / open // set shares quantity based on the startValue
      if (open > ma) {
        positionValue = Math.trunc(positionSize * close) //set current value
        TrailingSellStops(state, close, basis) //set the trailing sell stop basis to the open price, ignore the close price in this case
        currentState = LongAbove
      } else {
        positionValue = startValue //stay in cash
        TrailingBuyStops(state, close, basis) //set the trailing buy stop basis to the open price, ignore the close price in this case
        currentState = CashBelow
      }
    } else {
      // let testDate2 = `${date.getFullYear()} ${date.getMonth() + 1} ${date.getDate()}`
      // if (testDate2 === '2015 6 5') {
      //   debugger
      // }
      // if (testDate2 === '2019 5 30' && symbol === 'AMZN') {
      //   debugger
      // }

      // Set positionValue and currentState by checking the nextState signal for action at today's open
      // The CurrenAction at today's open is determined by the nextState that has been set by yesterday's call at the close to setNextState
      doCurrentAction(state, date, yesterday, open, close, nextState)
    }
    // add the current position value to the positionValues array
    positionValues.push({ date: date, close: positionValue })

    // set the day's code value for use by tomorrow's doCurrentAction
    yesterday = state.SMA === 'M' ? date.getDate() : date.getDay()

    // get the NextState based on today's close and the currentState
    setNextState(state, ma, close, currentState)

  } //<--loop back for the next bar

  // Finished processing the daily position values
  putEquityChart(symbol, positionValues) // rawEquityChart data array for this symbol
  setStaleCharts(false) // update status

  // Note: When appStateMachine is used in AcesTrader, we need to know if the next
  // action will be a Buy or Sell at the next day's open. Since we are in real time and
  // not testing historical price charts, we can create dummy data for tomorrow and call
  // doCurrentAction to see if a Buy or Sell is triggered. This result is passed back to 
  // the caller in AcesTrader to set the State property in the symbol's dashboard.
  // The only result from this call to doCurrentAction() that is important is the value of
  //  'currentState', 
  // Any caller from AcesTester ignores the second property in the returned object.

  const date = data[data.length - 1].date
  const open = data[data.length - 1].open
  const close = data[data.length - 1].close
  const fakeYesterday = date.getDay() // a fake yesterday date for this use of doCurrentAction() at this exit.
  const fakeTodayDate = new Date(date.getTime() + 1 * 24 * 60 * 60 * 1000)

  doCurrentAction(state, fakeTodayDate, fakeYesterday, open, close, nextState) // this sets the currentState of the asset for the next day

  return { positionValues: positionValues, currentState: currentState } //the finished positionValues array and the currentState for this symbol
}

// setNextState is called after the close to determine action at tomorrow's open
// The nextState is the state to be obtained via a trade at the open of the next day
// The nextState is set by a sequence of tests, each overriding any prior one
// They are arranged so that the most urgent is the winner

const setNextState = (state, ma, close, currentState) => {
  let stopSignal //records any stop activated by the close price
  // nextState = currentState //default is to make no change at the open
  const initialDayCount = state.SMA3 - 1 // Since the counter is zero based, subtract one from the specified value to get the expected countdown result

  switch (currentState) {
    case CashBelowLater: //waiting for dayCounter=0, still long position
      stopSignal = TrailingSellStops(state, close) //test the trailing stops
      if (close > ma) {
        nextState = LongAbove // back above ma before end of delay
        dayCounter = 0 // reset since not needed now
      } else if (close < ma && stopSignal === ts1 && state.ET1) {
        nextState = CashBelowNow // skip the wait period
        dayCounter = 0 // reset since not needed now
      } else {
        dayCounter-- // decrement toward zero
      }
      break

    case LongAbove:
      stopSignal = TrailingSellStops(state, close) //test the trailing stops
      if (close > ma) {
        nextState = LongAbove // no change at the open
        dayCounter = 0 // reset since not needed now
      }
      if (close < ma) {
        nextState = CashBelowLater // CashBelowLater waits for dayCounter=0  and then the long is cashed out at open
        dayCounter = dayCounter === 0 ? initialDayCount : dayCounter-- // initialize the first time close is below ma, else decrement to zero
      }
      if (close < ma && stopSignal === ts1 && state.ET1) {
        nextState = CashBelowNow // skip interval wait period
        dayCounter = 0 // reset since not needed now
      }
      if (close > ma && stopSignal === ts2 && state.ET2) {
        nextState = CashAboveNow // urgent exit
        dayCounter = 0 // reset since not needed now
      }
      break

    case LongAboveLater: //waiting for dayCounter=0, still in cash
      stopSignal = TrailingBuyStops(state, close) //test the trailing stops
      if (close < ma) {
        nextState = CashBelow // back below ma before dayCounter=0
        dayCounter = 0 // reset since not needed now
      } else if (close > ma && stopSignal === ts4 && state.ET4) {
        nextState = LongAboveNow // skip the wait period
        dayCounter = 0 // reset since not needed now
      } else {
        dayCounter-- // decrement toward zero
      }
      break

    case CashBelow:
      stopSignal = TrailingBuyStops(state, close) //test the trailing stops
      if (close < ma) {
        nextState = CashBelow // no change at the open
        dayCounter = 0 // reset since not needed now
      }
      if (close > ma) {
        nextState = LongAboveLater // LongAboveLater waits for dayCounter=0  and then goes long at open
        dayCounter = dayCounter === 0 ? initialDayCount : dayCounter-- // initialize the first time close is above ma, else decrement to zero
      }
      if (close > ma && stopSignal === ts4 && state.ET4) {
        nextState = LongAboveNow // skip interval wait period
        dayCounter = 0 // reset since not needed now
      }
      if (close < ma && stopSignal === ts5 && state.ET5) {
        nextState = LongBelowNow // urgent entry
        dayCounter = 0 // reset since not needed now
      }
      break

    case CashAbove:
      dayCounter = 0 // reset
      stopSignal = TrailingBuyStops(state, close) //test the trailing stops
      if (close > ma) {
        nextState = CashAbove // no action at the open
      }
      if (close > ma && stopSignal === ts3 && state.ET3) {
        nextState = LongAboveRevert // revert panic exit back to long
      }
      if (close < ma) {
        nextState = CashBelow // no trade at the open, change state
      }
      break

    case LongBelow:
      dayCounter = 0 // reset
      stopSignal = TrailingSellStops(state, close) //test the trailing stops
      if (close < ma) {
        nextState = LongBelow // no action at the open
      }
      if (close < ma && stopSignal === ts6 && state.ET6) {
        nextState = CashBelowRevert // revert urgent long back to cash
      }
      if (close > ma) {
        nextState = LongAbove // no trade at the open, change state
      }
      break

    default:
      debugger // pause for developer inspection
  }
}

// doCurrentAction changes the position's size value to effect any trade at the open based on the nextState code value
// But note that the position's equity value is based on the close price

const doCurrentAction = (state, date, yesterday, open, close, nextState) => {
  let toDay
  let basis = closeOnly ? close : open // modified 4/18/2018 to accommodate IEX pricing options
  switch (nextState) {
    //
    // These cases result in long positions
    case LongAbove:
      positionValue = Math.trunc(positionSize * close) // today's positionValue is based on the close price
      currentState = LongAbove //no trade
      break
    case LongAboveLater:
      // A long entry is done at the end of the specified set-days interval period
      if (state.SMA === 'D') {
        if (dayCounter === 0) {
          // interval period is over, go long at the open
          positionSize = positionValue / open // set shares quantity for the new long position
          positionValue = Math.trunc(positionSize * close) // today's positionValue is based on the close price
          TrailingSellStops(state, close, basis) //set the trailing sell stop basis
          currentState = LongAbove
          tradeMarker(symbol, date, 'L3', state.SMA3) // sma cross go Long at set days interval
        } else {
          currentState = LongAboveLater //no change in positionValue, no trade
        }
      } else {
        toDay = state.SMA === 'M' ? date.getDate() : date.getDay() // get appropriate day code value
        if (toDay < yesterday) {
          // first day of the next interval, go Long at the open
          positionSize = positionValue / open // set shares quantity for the new long position
          positionValue = Math.trunc(positionSize * close) // today's positionValue is based on the close price
          TrailingSellStops(state, close, basis) //set the trailing sell stop basis
          currentState = LongAbove
          let intervalCode = state.SMA === 'M' ? 'L1' : 'L2'  // deprecated 'L2' is for Weekly interval 
          tradeMarker(symbol, date, intervalCode) // sma cross Long at fixed interval
        }
      }
      break
    case LongAboveNow:
      // go Long above ma now before interval end
      positionSize = positionValue / open // set shares quantity for the new long position
      positionValue = Math.trunc(positionSize * close) // today's positionValue is based on the close price
      TrailingSellStops(state, close, basis) //set the trailing sell stop basis
      currentState = LongAbove
      tradeMarker(symbol, date, 'L4') // LongAbove Immediate
      break
    case LongBelowNow:
      // Urgent Buy below the ma cross
      positionSize = positionValue / open // set shares quantity for the new long position
      positionValue = Math.trunc(positionSize * close) // today's positionValue is based on the close price
      TrailingSellStops(state, close, basis) //set the trailing sell stop basis
      currentState = LongBelow
      tradeMarker(symbol, date, 'L5') // Urgent LongBelow
      break
    case LongAboveRevert:
      // in cash while above ma, change position now
      positionSize = positionValue / open // set shares quantity for the new long position
      positionValue = Math.trunc(positionSize * close) // today's positionValue is based on the close price
      TrailingSellStops(state, close, basis) //set the trailing sell stop basis
      currentState = LongAbove
      tradeMarker(symbol, date, 'L6') // Revert to long from panic sell
      break

    //
    // These cases result in cash positions
    case CashBelow:
      currentState = CashBelow //no change in positionValue, no trade
      break
    case CashBelowLater:
      // A exit to cash is done at the end of the specified set-day interval period
      if (state.SMA === 'D') {
        if (dayCounter === 0) {
          // interval period is over, go cash at the open
          positionValue = Math.trunc(positionSize * open) //go cash at this price
          positionSize = 0 // in cash with no position
          TrailingBuyStops(state, close, basis) //set the trailing buy stop basis
          currentState = CashBelow
          tradeMarker(symbol, date, 'C3', state.SMA3) // sma cross Cash at set days interval
        } else {
          currentState = CashBelowLater // still holding position
          positionValue = Math.trunc(positionSize * close) //today's value
        }
      } else {
        toDay = state.SMA === 'M' ? date.getDate() : date.getDay() // get appropriate day code value
        if (toDay < yesterday) {
          // first day of the next interval, go cash at the open
          positionValue = Math.trunc(positionSize * open) //go cash at this price
          positionSize = 0 // in cash with no position
          TrailingBuyStops(state, close, basis) //set the trailing buy stop basis
          currentState = CashBelow
          let intervalCode = state.SMA === 'M' ? 'C1' : 'C2'
          tradeMarker(symbol, date, intervalCode) // sma cross Cash at fixed interval
        } else {
          currentState = CashBelowLater // still holding position
          positionValue = Math.trunc(positionSize * close) //today's value
        }
      }
      break
    case CashBelowNow:
      // go to cash before interval end
      positionValue = Math.trunc(positionSize * open) //go cash at this price
      positionSize = 0 // in cash with no position
      TrailingBuyStops(state, close, basis) //set the trailing buy stop basis
      currentState = CashBelow
      tradeMarker(symbol, date, 'C4') // CashBelow Immediate
      break
    case CashAboveNow:
      // Urgent Sell before the ma cross
      positionValue = Math.trunc(positionSize * open) //go cash at this price
      positionSize = 0 // in cash with no position
      TrailingBuyStops(state, close, basis) //set the trailing buy stop basis
      currentState = CashAbove
      tradeMarker(symbol, date, 'C5') // Urgent CashAbove
      break
    case CashBelowRevert:
      // long while below ma, change position now
      positionValue = Math.trunc(positionSize * open) //go cash at this price
      positionSize = 0 // in cash with no position
      TrailingBuyStops(state, close, basis) //set the trailing buy stop basis
      currentState = CashBelow
      tradeMarker(symbol, date, 'C6') // Revert to cash from urgent buy long
      break
    default:
    // null, no change in state
  }
}

const TrailingSellStops = (state, close, basis = null) => {
  // return current signal using close value
  let signal = null
  if (basis) {
    // initialize a new stop. ignore close
    sellStopBasis = basis
  } else if (sellStopBasis && sellStopBasis <= close) {
    sellStopBasis = close // raise basis
  } else if (sellStopBasis && sellStopBasis > close) {
    let StopPrice6 = (sellStopBasis - (state.TS6 * sellStopBasis) / 100).toFixed(2)
    let StopPrice1 = (sellStopBasis - (state.TS1 * sellStopBasis) / 100).toFixed(2)
    let StopPrice2 = (sellStopBasis - (state.TS2 * sellStopBasis) / 100).toFixed(2)
    // keep these in this order so as to not mask more inportant ones by lesser ones, caller knows what to respond to.
    // only return a signal if that trading option is enabled
    if (StopPrice6 > close && state.ET6) signal = ts6
    if (StopPrice1 > close && state.ET1) signal = ts1
    if (StopPrice2 > close && state.ET2) signal = ts2
  } else {
    debugger // pause for developer inspection
  }
  return signal
}

const TrailingBuyStops = (state, close, basis = null) => {
  // return current signal using close
  let signal = null
  if (basis) {
    // initialize a new stop. ignore close
    buyStopBasis = basis
  } else if (buyStopBasis && buyStopBasis >= close) {
    buyStopBasis = close // lower basis
  } else if (buyStopBasis && buyStopBasis < close) {
    let StopPrice3 = (buyStopBasis + (state.TS3 * buyStopBasis) / 100).toFixed(2)
    let StopPrice4 = (buyStopBasis + (state.TS4 * buyStopBasis) / 100).toFixed(2)
    let StopPrice5 = (buyStopBasis + (state.TS5 * buyStopBasis) / 100).toFixed(2)
    // keep these in this order so as to not mask more inportant ones by lesser ones, caller knows what to respond to.
    // only return a signal if that trading option is enabled
    if (StopPrice3 < close && state.ET3) signal = ts3
    if (StopPrice4 < close && state.ET4) signal = ts4
    if (StopPrice5 < close && state.ET5) signal = ts5
  } else {
    debugger // pause for developer inspection
  }
  return signal
}

const tradeMarker = (symbol, date, label, daysSet = null) => {
  markers.push({ date: date, label: label }) // add to the array
  putTradeMarker(symbol, markers) // update the cache
  let legendItem = legendDictionary(label, daysSet)
  // console.log(`marker label ${label}: ${legendItem}`)
  legends.push({ date: date, label: `${label}: ${legendItem}` }) // add to the array
  putLegendItem(symbol, legends) // update the cache
}

const legendDictionary = (label, daysSet) => {
  const dictionary = {
    L1: 'Above ma at month end',
    L2: 'Above ma at week end',
    L3: `Above ma for ${daysSet} days`,
    L4: 'Above ma & buy stop',
    L5: 'Below ma & buy stop',
    L6: 'Restore long after "C5" sell',
    C1: 'Below ma at month end',
    C2: 'Below ma at week end',
    C3: `Below ma for ${daysSet} days`,
    C4: 'Below ma & sell stop',
    C5: 'Above ma & sell stop',
    C6: 'Restore cash after "L5" buy',
  }
  return dictionary[label]
}

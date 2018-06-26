//  redux/duckCharts

// ** The state.charts model holds data relating to
// ** the app's backend calculating functions.
import { NEW_PLAN_ALL_SLICES } from '../redux'
import { OPEN_PLAN_ALL_SLICES } from '../redux'
import { RESET_STATE } from '../redux'
import defaultState from '../json/defaultState.json'
var cloneDeep = require('lodash.clonedeep')

const INITIALIZE_CHARTS = 'blueduck.charts.INITIALIZE_CHARTS'
const CALCULATION_REQUEST = 'blueduck.charts.CALCULATION_REQUEST'
const CALCULATION_SUCCESS = 'blueduck.charts.CALCULATION_SUCCESS'
const CALCULATION_FAILURE = 'blueduck.charts.CALCULATION_FAILURE'

// *********reducer***********
// Redux delivers a slice of the state as defined by combineReducers(),
// so we create a corresponding slice of the defaultState as well.
const defaultCharts = cloneDeep(defaultState.charts) //in case state is undefined

export default function chartsReducer(state = defaultState, action) {
  switch (action.type) {
    case NEW_PLAN_ALL_SLICES: {
      return defaultCharts
    }
    case OPEN_PLAN_ALL_SLICES: {
      return { ...defaultCharts, chartObject: action.payload.chartObject }
    }
    case INITIALIZE_CHARTS: {
      return defaultCharts
    }
    case CALCULATION_REQUEST: {
      return { ...state, calculating: true }
    }
    case CALCULATION_FAILURE: {
      return { ...state, calculating: false, errorMessage: action.payload }
    }
    case CALCULATION_SUCCESS: {
      return {
        ...state,
        calculating: false,
        stale: false,
        chartObject: action.payload.chart,
        traceResult: action.payload.trace || null,
        warningMessage: action.payload.warning || null,
      }
    }
    case RESET_STATE: {
      return defaultCharts // reset this slice
    }
    default:
      return state
  }
}

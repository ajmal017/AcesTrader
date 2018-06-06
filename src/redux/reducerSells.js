// redux/reducerSells.js

import defaultState from '../json/defaultState.json'
import defaultDashboard from '../json/defaultDashboard.json'
import defaultShortEntry from '../json/defaultShortEntry.json'
import reduceProspects from './reduceProspects.js'
var cloneDeep = require('lodash.clonedeep')

const ADD_SELLS = 'ADD_SELLS'
const REMOVE_ONE_SELL = 'REMOVE_ONE_SELL'
const REMOVE_ALL_SELLS = 'REMOVE_ALL_SELLS'

export const addSellstoList = (sellsList) => {
  return {
    type: ADD_SELLS,
    sellsArray: sellsList,
  }
}
export const removeSellFromList = (sellName) => {
  return {
    type: REMOVE_ONE_SELL,
    symbol: sellName,
  }
}
export const removeAllSellsFromList = () => {
  return {
    type: REMOVE_ALL_SELLS,
  }
}

// *********reducer***********
// Redux delivers a slice of the state as defined by combineReducers(),
// so we create a corresponding slice of the defaultState as well.
const defaultSells = cloneDeep(defaultState.sells) //in case state is undefined

export default function sellsReducer(state = defaultSells, action) {
  switch (action.type) {
    case ADD_SELLS: {
      let newDashboard = Object.assign({}, defaultDashboard, defaultShortEntry)
      let newState = reduceProspects(state, action.sellsArray, newDashboard)
      return newState
    }
    // let newState = [] // start with empty array to be populated below
    // let newDashboard = Object.assign({}, defaultDashboard, defaultLongEntry)
    // let date = new Date()
    // let theDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
    // //Merge the prospective object lists in alphabetical order
    // let newList = action.sellsArray
    // let hh = 0
    // let kk = 0
    // let currentListSymbol = null
    // let newListSymbol = null
    // let newListObject = null
    // while (hh < state.length || kk < newList.length) {
    //   if (hh < state.length) {
    //     currentListSymbol = state[hh].symbol
    //   }
    //   if (kk < newList.length) {
    //     newListSymbol = newList[kk]
    //     newListObject = {
    //       symbol: newListSymbol,
    //       dashboard: newDashboard,
    //     }
    //   }
    //   if (!currentListSymbol) {
    //     //initial condition
    //     newState.push(newListObject)
    //     ++kk
    //   } else if (currentListSymbol < newListSymbol) {
    //     newState.push(state[hh])
    //     ++hh
    //   } else if (currentListSymbol > newListSymbol) {
    //     newState.push(newListObject)
    //     ++kk
    //   } else if (currentListSymbol === newListSymbol) {
    //     //newState.push(newListObject) //keep the new one
    //     newState.push(state[hh]) //keep the current one, skip new one
    //     ++hh
    //     ++kk
    //   }
    // }
    // return newState
    // }

    case REMOVE_ONE_SELL: {
      let newState = cloneDeep(defaultSells)
      //filter all except the action.symbol one
      newState = state.filter((obj) => obj.symbol !== action.symbol)
      return newState
    }
    case REMOVE_ALL_SELLS: {
      return cloneDeep(defaultSells)
    }
    default:
      return state
  }
}

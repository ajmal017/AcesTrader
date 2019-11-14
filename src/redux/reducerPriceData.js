// reducerPriceData.js

import defaultState from '../json/defaultState.json'
var cloneDeep = require('lodash.clonedeep')

const RESET_PERSISTED_STATE = 'RESET_PERSISTED_STATE' // a "magic string"

// *********reducer***********
// Redux delivers a slice of the state as defined by combineReducers(),
// so we create a corresponding slice of the defaultState as well.
const defaultResults = cloneDeep(defaultState.pricedata) //in case state is undefined

export default function chartsReducer(state = defaultResults, action) {
    switch (action.type) {
        case RESET_PERSISTED_STATE: {
            if (action.persistedState.pricedata) {
                return cloneDeep(action.persistedState.pricedata) //reset this state's slice to the persisted value
            }
            return cloneDeep(defaultResults)
        }
    }

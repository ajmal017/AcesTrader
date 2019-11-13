// appLoadPriceData.js

import { getPortfolioSymbols } from './appGetPortfolioSymbols'

export const LoadPriceData = async function(state) {
  // Get all the price data series files from IEX and put in the state
  const symbols = getPortfolioSymbols(state) // collect all the symbols in currently loaded portfolio
}

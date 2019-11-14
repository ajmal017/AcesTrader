// appSetDailyPrices.js
import { getPortfolioSymbols } from './appGetPortfolioSymbols'

export const setDailyPrices = async (state) => {
  const symbols = getPortfolioSymbols(state) // collect all the symbols in currently loaded portfolio
  const item = symbols[0]
  return null
}

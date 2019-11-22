// appGetPortfolioSymbols.js

export const getPortfolioSymbols = (state) => {
  const buysSymbols = state.buys.map((obj) => obj.symbol)
  const sellsSymbols = state.sells.map((obj) => obj.symbol)
  const longsSymbols = state.longs.map((obj) => obj.symbol)
  const shortsSymbols = state.shorts.map((obj) => obj.symbol)
  const trendbuysSymbols = state.trendbuys.map((obj) => obj.symbol)
  const trendlongsSymbols = state.trendlongs.map((obj) => obj.symbol)
  const symbols = [...buysSymbols, ...sellsSymbols, ...longsSymbols, ...shortsSymbols, ...trendbuysSymbols, ...trendlongsSymbols]
  return symbols
}

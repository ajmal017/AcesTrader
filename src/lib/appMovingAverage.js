// appMovingAverage
// Provides an API to calculate a simple moving average
// Uses a ring array with a length of the sma period to calculate each sma value
// Uses a normal array to hold the sma output values

let smaArray = []
let ringArray = []
let ringSize = 0
// let readIndex = 0
let writeIndex = 0
let smaIndex = 0

// Initialize with the simple moving average period and size
export const initSma = (smaPeriod, seriesSize) => {
  ringArray = Array.from({ length: smaPeriod })
  ringSize = smaPeriod
  smaArray = Array.from({ length: seriesSize })
  // readIndex = 0
  writeIndex = 0
  smaIndex = 0
}

// Add the new price from the input in time sequence; calculate the sma for each new ring array state
export const addSmaPrice = (price, date) => {
  ringArray[writeIndex % ringSize] = price // the index wraps around to overwrite older items
  writeIndex++
  if (writeIndex >= ringSize) {
    let smaSum = ringArray.reduce((total, currentValue) => total + currentValue, 0)
    let smaValue = smaSum / ringSize
    let smaArrayItem = { smaValue: smaValue, date: date }
    smaArray[smaIndex] = smaArrayItem
    smaIndex++
  }
}

// Return the array of the simple moving average objects
export const getSmaArray = () => {
  return smaArray.slice(0, smaIndex)
}

// // remove the oldest price
// export const drop = () => {
//   readIndex++
// }

// //
// export const get = () => {
//   let item = array[readIndex % ringSize]
//   readIndex++
//   return item
// }

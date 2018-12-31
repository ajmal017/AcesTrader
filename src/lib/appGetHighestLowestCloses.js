// appGetHighestLowestCloses.js

export const getHighestLowestCloses = (last20Closes, entered) => {
  let theHighestLowest = { highest: null, lowest: null }

  if (!last20Closes || last20Closes.length === 0) {
    return theHighestLowest //null results
  } else {
    const enteredDate = new Date(entered)
    let highestClose = 0
    let lowestClose = 9999999
    for (let kk = 0; kk < last20Closes.length; kk++) {
      let timeDiff = new Date(last20Closes[kk].date) - enteredDate
      let daysDiff = Math.round(timeDiff / (1000 * 3600 * 24))
      if (daysDiff > 0) {
        // the close date is after the enter date
        if (lowestClose > last20Closes[kk].close) {
          lowestClose = last20Closes[kk].close
        }
        if (highestClose < last20Closes[kk].close) {
          highestClose = last20Closes[kk].close
        }
      }
    }
    theHighestLowest.highest = highestClose
    theHighestLowest.lowest = lowestClose
    return theHighestLowest //found results
  }
}

// export default getHighestLowestCloses

//     const timeDiff = endDate - startDate
//     let daysHere = Math.round(Math.abs(timeDiff / (1000 * 3600 * 24)))
//     if (daysHere < 20) {
//       last20Closes = getLast20Closes(symbol).slice(-daysHere)
//     } //restrict testing to just the relevant days

//     if (obj.dashboard.tradeSide === 'Shorts') {
//       let lowestClose = 9999999
//       for (let kk = 0; kk < last20Closes.length; kk++) {
//         if (lowestClose > last20Closes[kk]) {
//           lowestClose = last20Closes[kk]
//         }
//       }
//       if (obj.trailingStopBasis > lowestClose) {
//         obj.trailingStopBasis = lowestClose
//         updated = true
//       }
//     } else if (obj.dashboard.tradeSide === 'Longs' || obj.dashboard.tradeSide === 'Trend Longs') {
//       let highestClose = 0
//       for (let kk = 0; kk < last20Closes.length; kk++) {
//         if (highestClose < last20Closes[kk]) {
//           highestClose = last20Closes[kk]
//         }
//         if (obj.trailingStopBasis < highestClose) {
//           obj.trailingStopBasis = highestClose
//           updated = true
//         }
//       }
//     }
//   }
// }

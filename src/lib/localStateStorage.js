// localStateStorage.js

var base64 = require('base-64')

export const islocalStorageWorking = () => {
  let plan = new Array(25000 + 1).join('x') //make a 50kB file. Each JS character is 2 bytes
  try {
    let localStorage = window.localStorage // test if LocalStorage is supported on this device
    localStorage.setItem('xx-test', plan) // test if saving the test plan does not exceed the storage quota
    localStorage.removeItem('xx-test') // no errors thrown by above tests so remove test plan
    // return false // THIS IS USED HERE TO TEST THE RESPONSE MESSAGE GENERATED
    return true // localStorage working
  } catch (err) {
    return false // Access denied or space is full (the usual storage quota is 5 megabytes)
  }
}

export const loadLocalState = (key) => {
  // localStorage.removeItem(key) //TEMP - enable to reset state
  try {
    let serializedState = localStorage.getItem(key)
    if (serializedState === null) {
      return undefined // so that reducers will use default state
    }
    serializedState = base64.decode(serializedState)
    // let stateSize = serializedState.length //for developer info
    let objectState = JSON.parse(serializedState)
    // console.log(JSON.stringify(objectState, null, 2)) // a readable log of the object's json
    // Right click > Copy All in the Console panel to copy to clipboard
    return objectState
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      debugger
    }
    return undefined // so that reducers will use default state
  }
}

export const saveLocalState = (key, state) => {
  try {
    let serializedState = JSON.stringify(state)
    serializedState = base64.encode(serializedState)
    localStorage.setItem(key, serializedState)
    return true
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      debugger
    }
    if (isQuotaExceeded(err)) {
      // Storage full, maybe notify user or do some clean-up
      return false
    }
    return false
  }
}

// export const deletePlan = (planName) => {
//   localStorage.removeItem(planName)
// }

// export const savePlan = (planName, planObject) => {
//   try {
//     let serializedPlan = JSON.stringify(planObject)
//     serializedPlan = base64.encode(serializedPlan)
//     localStorage.setItem(planName, serializedPlan)
//     return true
//   } catch (err) {
//     if (isQuotaExceeded(err)) {
//       // Storage full, maybe notify user or do some clean-up
//       return false
//     }
//     if (process.env.NODE_ENV !== 'production') {
//       debugger
//     }
//   }
// }

// export const loadPlan = (planName) => {
//   try {
//     let serializedPlan = localStorage.getItem(planName)
//     if (serializedPlan === null) {
//       return undefined // so that reducers will use default state
//     }
//     if (/^eyJm/.test(serializedPlan)) {
//       //this is base64 encoded json characters
//       serializedPlan = base64.decode(serializedPlan)
//     }
//     let objectPlan = JSON.parse(serializedPlan)
//     return objectPlan
//   } catch (err) {
//     if (process.env.NODE_ENV !== 'production') {
//       debugger
//     }
//     return undefined // so that reducers will use default state
//   }
// }

// export const loadBase64Plan = (planName) => {
//   // this gets a plan file for exporting to the device file system
//   try {
//     let serializedPlan = localStorage.getItem(planName)
//     return serializedPlan //might be null
//   } catch (err) {
//     if (process.env.NODE_ENV === 'development') {
//       debugger
//     }
//     return null
//   }
// }

function isQuotaExceeded(err) {
  var quotaExceeded = false
  if (err) {
    if (err.code) {
      switch (err.code) {
        case 22:
          quotaExceeded = true
          break
        case 1014:
          // Firefox
          if (err.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
            quotaExceeded = true
          }
          break
        default:
      }
    } else if (err.number === -2147024882) {
      // Internet Explorer 8
      quotaExceeded = true
    }
  }
  return quotaExceeded
}

// function forceQuotaExceeded() {
//   var exception
//   var repeat = function(str, x) {
//     return new Array(x + 1).join(str)
//   }
//   var too_big = repeat('x', 12 * 1024 * 1024 / 2) // each JS character is 2 bytes
//   localStorage.clear() //*****NOTE THIS SIDE EFFECT IF YOU USE THIS*****
//   try {
//     localStorage.setItem('test', too_big)
//   } catch (err) {
//     if (isQuotaExceeded(err)) {
//       // Storage full, maybe notify user or do some clean-up
//       debugger
//     }
//   }
// }

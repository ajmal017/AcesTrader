// appSaveTheState.js

import fire from '../fire'
import { getReference } from './dbReference'
// import { replaceModifiedPricedata } from '../redux/reducerPriceData'

export const saveTheNewState = async function(state, dispatch) {
  let cleanState = JSON.parse(JSON.stringify(state))
  // Because state can contain properties with value=func(), the above hack removes them.
  // For example after a modal dialog sequence, because of the callback provided we have:
  // property 'papertrader.modal.handleModalResonse' with contents = function ()

  // dispatch(replaceModifiedPricedata(state.priceData))
  // // debugger

  let reference = getReference()
  const priceDataReference = reference + '/priceData'
  debugger // BCM ===
  fire
    .database()
    .ref(priceDataReference)
    .set(cleanState, function(error) {
      if (error) {
        console.log('Firebase: The database write failed while saving the changed state. Error: ' + error)
        if (process.env.NODE_ENV === 'development') {
          debugger
        } //pause for developer
        alert('Firebase: The fire.database write failed while saving the changed state. Error: ' + error) //rude interruption to user
      }
    })
}

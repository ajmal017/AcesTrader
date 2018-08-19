// dbReference.js

export const referenceAcestrader = 'acestrader' //1st cloud database
export const referencePapertrader = 'papertrader' //2nd cloud database
export const localtrader = 'localtrader' //using local storage

let currentReference = referenceAcestrader //set now for tests

export const putReference = (reference) => {
  currentReference = reference
}

export const getReference = () => currentReference

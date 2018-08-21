// dbReference.js

export const referenceRealtrader = 'realtrader' //1st cloud database
export const referencePapertrader = 'papertrader' //2nd cloud database
export const localtrader = 'localtrader' //using local storage

let currentReference = localtrader // default if not changed at sign in

export const putReference = (reference) => {
  currentReference = reference
}

export const getReference = () => currentReference

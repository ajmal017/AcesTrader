// dbReference.js

export const referenceRealtrader = 'realtrader' //1st cloud database
export const referencePapertrader = 'papertrader' //2nd cloud database
export const referenceLocaltrader = 'localtrader' //using local storage

// let currentReference = referencePapertrader // default if not changed at sign in
let currentReference = referenceLocaltrader // default if not changed at sign in

export const putReference = (reference) => {
  currentReference = reference
}

export const getReference = () => currentReference

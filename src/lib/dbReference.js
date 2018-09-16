// dbReference.js

export const referenceRealtrader = 'realtrader' // 1st cloud database
export const referencePapertrader = 'papertrader' // 2nd cloud database
export const referenceDebugtrader = 'debugtrader' // 3nd cloud database
export const referenceLocaltrader = 'localtrader' // using local storage
export const referenceTempIgnore = 'tempignore' // used when recovering persisted state from storage during initial startup

let currentReference = referenceLocaltrader // default if not changed at sign in
// if (process.env.NODE_ENV === 'development') currentReference = referenceDebugtrader

export const putReference = (reference) => {
  currentReference = reference
}

export const getReference = () => currentReference

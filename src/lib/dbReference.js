// dbReference.js

export const referenceRealtrader = 'realtrader' // 1st cloud database
export const referencePapertrader = 'papertrader' // 2nd cloud database
export const referenceDebugtrader = 'debugtrader' // 3nd cloud database
export const referenceLocaltrader = 'localtrader' // using local storage

export const ameritrade = 'ameritrade'
export const schwab = 'schwab'
export const paper = 'paper'

export const BruceIRA = 'BruceIRA'
export const BetsyIRA = 'BetsyIRA'
export const BBJoint = 'BBJoint'
export const LauraIRA = 'LauraIRA'
export const LauraJoint = 'LauraJoint'

let currentReference = paper // default if not changed at sign in
// if (process.env.NODE_ENV === 'development') currentReference = referenceDebugtrader

export const putReference = (reference) => {
  currentReference = reference
}

export const getReference = () => currentReference

// dbAccountReference.js

export const Paper = 'Paper'
export const Ameritrade = 'Ameritrade'
export const Schwab = 'Schwab'

export const BruceIRA = 'BruceIRA'
export const BetsyIRA = 'BetsyIRA'
export const BBJoint = 'BBJoint'
export const LauraIRA = 'LauraIRA'
export const LauraJoint = 'LauraJoint'

let currentAccountReference = Paper // default if not changed at sign in
// if (process.env.NODE_ENV === 'development') currentReference = referenceDebugtrader

export const putAccountReference = (reference) => {
  currentAccountReference = reference
}

export const getAccountReference = () => currentAccountReference

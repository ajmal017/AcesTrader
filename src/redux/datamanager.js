// datamanager.js
import { savePlan } from '../../../redux/localStorage'

export const saveToLocalStorage = (planName, planObject, plansList = null) => {
  'use-strict'
  // Saves serialized plan object to local storage.
  // The plan's dirty is set to false.
  // The plan's staleCharts is set to true.
  // If planList array is suppied, plan name is added to array
  // The serialized plan object is returned as a string
  let planJson = JSON.stringify(planObject)
}

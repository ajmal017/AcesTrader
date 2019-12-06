// appGetDaysDiff.js

import { differenceInCalendarDays } from 'date-fns'
export const getDaysDiff = (aa, bb) => {
  // Be careful of time zone differences resulting in a one day error.
  // Best to normalize inputs just year, month, day strings first.
  let daysDiff = differenceInCalendarDays(new Date(aa), new Date(bb))
  return Math.abs(daysDiff) //correct for wrong order of inputs
}

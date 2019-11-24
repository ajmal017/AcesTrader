// appGetDaysDiff.js

import differenceInCalendarDays from 'date-fns/differenceInCalendarDays'

export const getDaysDiff = (aa, bb) => {
  let daysDiff = differenceInCalendarDays(new Date(aa), new Date(bb))
  return Math.abs(daysDiff) //correct for wrong order of inputs
}

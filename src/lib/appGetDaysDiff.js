// appGetDaysDiff.js

export const getDaysDiff = (aa, bb) => {
  const a = new Date(aa)
  const b = new Date(bb)

  // Comparing dates without time - Scroll to "BEWARE THE TIMEZONE" in the url below:
  // https://stackoverflow.com/questions/2698725/comparing-date-part-only-without-comparing-time-in-javascript
  // const aDate = new Date(Date.UTC(a.getUTCFullYear(), a.getUTCMonth(), a.getUTCDate()))
  // const bDate = new Date(Date.UTC(b.getUTCFullYear(), b.getUTCMonth(), b.getUTCDate()))

  const aDate = new Date(Date.UTC(a.getFullYear(), a.getMonth(), a.getDate()))
  const bDate = new Date(Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()))

  const daysDiff = (bDate.getTime() - aDate.getTime()) / (1000 * 3600 * 24)
  return Math.abs(daysDiff) //correct for wrong order of inputs
}

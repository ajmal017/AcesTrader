// appgetTheDateAsString.js

export const getTheDateAsString = (date) => {
  const theDate = date ? new Date(date) : new Date() // prop's date or today's date
  const nowYear = theDate.getFullYear() //returns the year as a 4 digit number
  const nowMonth = theDate.getMonth() + 1 //returns the month as a number (0-11) plus one
  const nowDay = theDate.getDate() //returns the month as a number (0-11) plus one
  const stringDate = `${nowYear}-${nowMonth < 10 ? 0 : ''}${nowMonth}-${nowDay < 10 ? 0 : ''}${nowDay}` // today's date with 2 digit months & days
  return stringDate // "yyyy-mm-dd"
}

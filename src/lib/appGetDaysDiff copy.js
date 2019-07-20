// appGetDaysDiff.js

export const getDaysDiff = (aa, bb) => {
    let a = new Date(aa) // should be the earliest
    let b = new Date(bb)
    // test the two inputs for correct order
    if (a > b) {
        // incorrect order, switch around
        let x = a
        a = b
        b = x
    }

    let dif = theDaysDif(a, b) // first method to find difference
    if (dif) {
        return dif // exit with the days difference
    } else {
        // assume the later month is one past the earlier month


        // Another method advances the earlyDate until it matches the laterDate
        let earlyDate = new Date(a) // the date to be advanced by the setDate method

        // The setDate() method sets the day of the month to theDate parameter.
        // Date.setDate(date)
        // If the month has 31 days:
        // 32 will result in the first day of the next month
        // If the month has 30 days:
        // 32 will result in the second day of the next month
        let theDate = 32
        let diffCount = 0
        do {
            diffCount += theDate // count the days added to the difference
            earlyDate = earlyDate.setDate(theDate) // bump the month to reach equal year and month

            let result = theDaysDif(earlyDate, b)) // run the test


        } while (0 !== theDaysDif(earlyDate, b)) // test for same day
        return days // exit with the days difference
    }
}

const theDaysDif = (a, b) => {
    if (a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()) {
        return (b.getDate() - a.getDate()) // the difference between two days in same month
    } else {
        return null // signal need for another method
    }
}


    // const aYear = a.getFullYear()
    // const bYear = b.getFullYear()
    // const aMonth = a.getMonth() // note zero indexing
    // const bMonth = b.getMonth()
    // const aDate = a.getDate()
    // const bDate = b.getDate()
    // if (aYear === bYear && aMonth === bMonth) {
    //     return (b - a)
    // }



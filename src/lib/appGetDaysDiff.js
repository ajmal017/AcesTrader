// appGetDaysDiff.js

export const getDaysDiff = (aa, bb) => {
    let a = new Date(aa)
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
        // Another method is required
        let finalDate = new Date(a) // the date to be modified by the setDate method
        let days = 0
        do {
            if (days > 400) {
                alert(`Error in getDaysDiff(), no match after ${days} days`)
                debugger // pause for developer
            }
            days += 1 // add a day to the count
            finalDate.setDate(a.getDate() + days) // bump the date by new count
        } while (0 !== theDaysDif(b, finalDate)) // test for same day
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



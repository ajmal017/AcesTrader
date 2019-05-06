// apploadPortfolioData.js

import { resetPeekPrices } from '../lib/appLastPeekPrice'
import { resetDataCache } from '../lib/chartDataCache'
import fire from '../fire'

const loadPortfolioData = async function (reference) {

    resetDataCache() // clear all previously cached chart price data for fresh start
    resetPeekPrices() //clear old peek symbol prices for fresh start
    let persistedState = null // receives the state loaded from database
    console.log(`loadPortfolioData begin:, reference=${reference}`) //BCM

    try {

        // fire
        //     .database()
        //     .ref(reference) // see lib/dbReference.js for possible values
        //     .once('value')
        //     .then(function (snapshot) {
        //         console.log(`fire.database.ref.once resolved: snapshot=${snapshot}`) //BCM
        //         if (snapshot) {
        //             document.title = 'AcesTrader ' + reference[0].toUpperCase() + reference.substr(1)
        //             persistedState = snapshot.val()
        //             debugger //==BCM==
        //             return persistedState //<=======EARLY EXIT=========
        //         } else {
        //             // alert('Firebase: The App database read returned an unsuccessful messsage') //rude interruption to user
        //             debugger
        //             return false
        //         }
        //     })



        let snapshot = fire
            .database()
            .ref(reference) // see lib/dbReference.js for possible values
            .once('value')
            await snapshot
            console.log(`fire.database.ref.once resolved: snapshot=${snapshot}`) //BCM
            if (snapshot) {
                document.title = 'AcesTrader ' + reference[0].toUpperCase() + reference.substr(1)
                // debugger //==BCM==
                persistedState = snapshot.val()
                return persistedState //<=======EARLY EXIT=========
            } else {
                // alert('Firebase: The App database read returned an unsuccessful messsage') //rude interruption to user
                debugger
                return false
            }

    } catch (err) {
        // alert('Firebase: The StartUp/index database read failed while retrieving the state. Error: ' + err.message) //rude interruption to user
        debugger
        return false
    }
}
export default loadPortfolioData

// //Note: this provides access to redux's dispatch()
// //Use a no-op function to avoid triggering a re-render due to a state change.
// //We are not concerned with state, we only want to run when called,
// //but we need access to dispatch()
// const mapStateToProps = () => ({})
// export default withRouter(connect(mapStateToProps)(loadPortfolioData))


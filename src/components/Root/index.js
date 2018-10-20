// Root/index.js

import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Appnav from '../../components/Appnav/'
// import Alerts from '../../components/Alerts/'
import SignIn from '../../components/SignIn/'
import SignUp from '../../components/SignUp/'
import SignOut from '../../components/SignOut/'
import StartUp from '../../components/StartUp/'
import ProspectBuys from '../../components/ProspectBuys/'
import ProspectSells from '../../components/ProspectSells/'
import ProspectTrendBuys from '../../components/ProspectTrendBuys/'
import PositionLongs from '../../components/PositionLongs/'
import PositionShorts from '../../components/PositionShorts/'
import PositionTrendLongs from '../../components/PositionTrendLongs/'
import Results from '../../components/Results/'
import Peek from '../../components/Peek/'
import ManageBuyProspects from '../../components/ManageBuyProspects/'
import ManageSellProspects from '../../components/ManageSellProspects/'
import ManageTrendBuyProspects from '../../components/ManageTrendBuyProspects/'
import Home from '../../components/Home/'
import Welcome from '../../components/Welcome/'
import EraseLists from '../../components/EraseLists/'
import Charts from '../../components/Charts/'
import PortalModal from '../../components/PortalModal/'
import PrivateRoute from '../../PrivateRoute'
import NotFound from '../../components/NotFound'

// import defaultState from '../../json/defaultState.json'
// <Provider store={store ? store : { getState: () => defaultState, subscribe: () => {} }}>

const Root = ({ store, authenticated }) => (
  <Provider store={store}>
    <div>
      <PortalModal />
      <Router>
        <div>
          <Route component={Appnav} />
          <Switch>
            <PrivateRoute exact path="/" component={Home} authenticated={authenticated} />
            <Route exact path="/Home" component={Home} />
            <PrivateRoute exact path="/positionlongs" component={PositionLongs} authenticated={authenticated} />
            <PrivateRoute exact path="/positionshorts" component={PositionShorts} authenticated={authenticated} />
            <PrivateRoute exact path="/positiontrendlongs" component={PositionTrendLongs} authenticated={authenticated} />
            <PrivateRoute exact path="/prospectbuys" component={ProspectBuys} authenticated={authenticated} />
            <PrivateRoute exact path="/prospectsells" component={ProspectSells} authenticated={authenticated} />
            <PrivateRoute exact path="/prospecttrendbuys" component={ProspectTrendBuys} authenticated={authenticated} />
            <PrivateRoute exact path="/results" component={Results} authenticated={authenticated} />
            <PrivateRoute exact path="/peek" component={Peek} authenticated={authenticated} />
            <PrivateRoute exact path="/managebuyprospects" component={ManageBuyProspects} authenticated={authenticated} />
            <PrivateRoute exact path="/managesellprospects" component={ManageSellProspects} authenticated={authenticated} />
            <PrivateRoute exact path="/managetrendbuyprospects" component={ManageTrendBuyProspects} authenticated={authenticated} />
            <PrivateRoute exact path="/eraseLists" component={EraseLists} authenticated={authenticated} />
            <PrivateRoute exact path="/charts" component={Charts} authenticated={authenticated} />
            <PrivateRoute exact path="/signout" component={SignOut} authenticated={authenticated} />
            {/* <PrivateRoute exact path="/welcome" component={Welcome} authenticated={authenticated} /> */}
            <Route exact path="/welcome" component={Welcome} />
            <Route exact path="/signup" component={SignUp} />
            <Route exact path="/signin" component={SignIn} />
            <Route exact path="/startUp" component={StartUp} />
            <Route component={NotFound} />{' '}
          </Switch>
        </div>
      </Router>
    </div>
  </Provider>
)

Root.propTypes = {
  store: PropTypes.object.isRequired,
  authenticated: PropTypes.bool.isRequired,
}

export default Root

// {/* <Route exact path="/" component={Home} /> */}

// <Route exact path="/home" component={Home} />
// <Route exact path="/positionlongs" component={PositionLongs} />
// <Route exact path="/positionshorts" component={PositionShorts} />
// <Route exact path="/positiontrendlongs" component={PositionTrendLongs} />
// <Route exact path="/prospectbuys" component={ProspectBuys} />
// <Route exact path="/prospectsells" component={ProspectSells} />
// <Route exact path="/prospecttrendbuys" component={ProspectTrendBuys} />
// <Route exact path="/results" component={Results} />
// <Route exact path="/peek" component={Peek} />
// <Route exact path="/managebuyprospects" component={ManageBuyProspects} />
// <Route exact path="/managesellprospects" component={ManageSellProspects} />
// <Route exact path="/managetrendbuyprospects" component={ManageTrendBuyProspects} />
// <Route exact path="/eraseLists" component={EraseLists} />
// <Route exact path="/charts" component={Charts} />
// <Route exact path="/signout" component={SignOut} />
// <Route exact path="/welcome" component={Welcome} />

// {/* <Route exact path="/signup" component={SignUp} /> */}
// {/* <Route exact path="/signin" component={SignIn} /> */}

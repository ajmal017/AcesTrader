// Root/index.js

import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Appnav from '../../components/Appnav/'
import Alerts from '../../components/Alerts/'
import ProspectBuys from '../../components/ProspectBuys/'
import ProspectSells from '../../components/ProspectSells/'
import PositionLongs from '../../components/PositionLongs/'
import PositionShorts from '../../components/PositionShorts/'
import Trades from '../../components/Trades/'
import Peek from '../../components/Peek/'
import ManageBuyProspects from '../../components/ManageBuyProspects/'
import ManageSellProspects from '../../components/ManageSellProspects/'
import Home from '../../components/Home/'
import Charts from '../../components/Charts/'
import PortalModal from '../../components/PortalModal/'

const Root = ({ store }) => (
  <Provider store={store}>
    <div>
      <PortalModal />
      <Router>
        <div>
          <Route component={Appnav} />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/alerts" component={Alerts} />
            <Route exact path="/positionlongs" component={PositionLongs} />
            <Route exact path="/positionshorts" component={PositionShorts} />
            <Route exact path="/prospectbuys" component={ProspectBuys} />
            <Route exact path="/prospectsells" component={ProspectSells} />
            <Route exact path="/trades" component={Trades} />
            <Route exact path="/peek" component={Peek} />
            <Route exact path="/managebuyprospects" component={ManageBuyProspects} />
            <Route exact path="/managesellprospects" component={ManageSellProspects} />
            <Route exact path="/home" component={Home} />
            <Route exact path="/charts" component={Charts} />
          </Switch>
        </div>
      </Router>
    </div>
  </Provider>
)

Root.propTypes = {
  store: PropTypes.object.isRequired,
}

export default Root

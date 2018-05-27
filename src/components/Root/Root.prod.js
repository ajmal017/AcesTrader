// Root.prod

import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Appnav from '../../components/Appnav/'
import Home from '../../components/Home/'
import New from '../../components/New/'
import Select from '../../components/Select/'
import Import from '../../components/Import/'
import Save from '../../components/Save/'
import Saveas from '../../components/Saveas/'
import Delete from '../../components/Delete/'
import Close from '../../components/Close/'
import Exit from '../../components/Exit/'
// import Plan from '../../components/Plan/'
// import Charts from '../../components/Charts/'
import MonteCarlo from '../../components/MonteCarlo/'
import Forecaster from '../../components/Forecaster/'
import Signin from '../../components/Signin/'
import Docs from '../../components/Docs/'
import Readme from '../../components/Readme/'
import About from '../../components/About/'
import Requesttrace from '../../components/Requesttrace/'
import Readtracelog from '../../components/Readtracelog/'
import Readerrorlog from '../../components/Readerrorlog/'
import PortalModal from '../../components/PortalModal/'

const Root = ({ store }) => (
  <Provider store={store}>
    <div>
      <PortalModal />
      <Router>
        <div>
          <Route component={Appnav} />
          <Switch>
            <Route exact path="/" component={Forecaster} />
            <Route exact path="/home" component={Home} />
            <Route exact path="/new" component={New} />
            <Route exact path="/select" component={Select} />
            <Route exact path="/import" component={Import} />
            <Route exact path="/save" component={Save} />
            <Route exact path="/saveas" component={Saveas} />
            <Route exact path="/delete" component={Delete} />
            <Route exact path="/close" component={Close} />
            <Route exact path="/exit" component={Exit} />
            {/* <Route exact path="/plan" component={Plan} /> */}
            {/* <Route exact path="/charts" component={Charts} /> */}
            <Route exact path="/montecarlo" component={MonteCarlo} />
            <Route exact path="/forecaster" component={Forecaster} />
            <Route exact path="/requesttrace" component={Requesttrace} />
            <Route exact path="/readtracelog" component={Readtracelog} />
            <Route exact path="/readerrorlog" component={Readerrorlog} />
            {/* <Route exact path="/examples" component={Examples} /> */}
            <Route exact path="/docs" component={Docs} />
            <Route exact path="/readme" component={Readme} />
            <Route exact path="/about" component={About} />
            <Route exact path="/signin" component={Signin} />
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

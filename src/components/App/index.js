// app/index.js

import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import PrivateRoute from '../../PrivateRoute'
import fire from '../../fire'
import StartUp from '../StartUp'
import SignIn from '../SignIn'
import SignUp from '../SignUp'

class App extends Component {
  constructor(props) {
    super(props)
    this.store = null // receives the created store
    this.state = { loading: true, authenticated: false, user: null }
  }

  componentDidMount() {
    // let persistedState = undefined // persistedStat=undefined creates the default initial state as specified by the reducers defaults
    // // we create the store with all the available middlewares; they are controlled dynamically depending on the user's role
    // this.store = createStore(rootReducer, persistedState, applyMiddleware(firebaseSaveState(), thunk, logger))

    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          authenticated: true,
          currentUser: user,
          loading: false,
        })
      } else {
        this.setState({
          authenticated: false,
          currentUser: null,
          loading: false,
        })
      }
    })
  }

  render() {
    const { loading, authenticated } = this.state

    if (loading) {
      const divStyle = { marginTop: 80, marginLeft: 50 }
      return (
        <div style={divStyle}>
          <h4>{`Loading The App. Please Wait...`}</h4>
        </div>
      )
    } else {
      return (
        <Router>
          <div>
            <PrivateRoute exact path="/" component={StartUp} authenticated={this.state.authenticated} />
            <Route exact path="/signin" component={SignIn} />
            <Route exact path="/signup" component={SignUp} />
          </div>
        </Router>
      )
    }
  }
}

export default App

// Welcome/index.js

import React, { Component } from 'react'
import { getReference, referenceLocaltrader } from '../../lib/dbReference'
import { connect } from 'react-redux'
import HomeJumbotron from '../../components/Home/HomeJumbotron'
import welcomeDemoTrader from './welcomeDemoTrader'
import welcomeTrader from './welcomeTrader'
import HomeFootnote from '../../components/Home/HomeFootnote'
import makeNewStateCopy from '../../../src/redux'
import './styles.css'

class Welcome extends Component {
  constructor(props) {
    super(props)
    // this.state = { stateRetrieved: 'pending' }
    this.reference = null // identifies the DB source for the app's store
  }

  componentDidMount() {
    window.scrollTo(0, 0)
    this.reference = getReference() //indicates user's role
    // this.props.dispatch(makeNewStateCopy)
    // setTimeout(this.props.dispatch(makeNewStateCopy), 1000)
  }

  render() {
    return (
      <div>
        <div>
          <HomeJumbotron />
        </div>
        <div className={'welcome-content'}>{this.reference === referenceLocaltrader ? welcomeDemoTrader() : welcomeTrader(this.reference)}</div>
        <div>
          <HomeFootnote />
        </div>
      </div>
    )
  }
}

//Note: this used only to get access to "this.props.dispatch", not for state access
const mapStateToProps = (state) => ({
  state: state,
})
export default connect(mapStateToProps)(Welcome)

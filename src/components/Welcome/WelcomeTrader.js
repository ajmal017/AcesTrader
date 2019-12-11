// WelcomeTrader.js

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import styled from 'styled-components'
import './WelcomeTrader.css'
import { setSandboxStatus, getSandboxStatus } from '../../lib/appUseSandboxStatus'
import { resetDefaultState, resetPersistedState } from '../../redux/index.js'
import { putReference, getReference, ameritrade, schwab, paper } from '../../lib/dbReference'
import { setPeekPrices } from '../../lib/appSetPeekPrices'
import { setDailyPrices } from '../../lib/appSetDailyPrices'

import { resetDataCache } from '../../lib/chartDataCache'
import fire from '../../fire'

const Wrapper = styled.section`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr 30px;
  grid-template-areas:
    'title'
    'header'
    'content'
    'footer';
`
const Background = styled.div.attrs({
  className: 'backgroundDollar',
})`
  grid-area: title;
`
const Title = styled.span`
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
  padding-top: 52px;
  padding-bottom: 48px;
  font-family: Arial Rounded MT Bold, 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-size: 32px;
  font-weight: bold;
  color: #5c7cfa;
`
const Header = styled.h2`
  grid-area: header;
  margin-top: 60px;
  margin-bottom: 40px;
  justify-self: center;
`
const Content = styled.section`
  grid-area: content;
  padding-right: 14%;
  padding-left: 14%;
  background-color: #ecf0f1;
`
const ControlGroup = styled.section`
  display: flex;
  @media (min-width: 700px) {
    // flex-flow: row wrap;
    // align-items: center;
    justify-content: center;
    margin-top: 4px;
    margin-bottom: 46px;
  }
  @media (max-width: 700px) {
    flex-direction: column;
  }
`
const RadioGroupItem = styled.section`
  height: 100%;
  @media (max-width: 700px) {
    margin-left: 66px;
    margin-bottom: 46px;
  }
`
const RadioInput = styled.input`
  width: 37px;
  height: 37px;
  cursor: 'pointer';
  // border: 4px;
`
const RadioLabel = styled.section`
  display: inline;
  // width: 37px;
  // height: 37px;
  // margin-bottom: 20px;
  margin-right: 36px;
  font-size: 18px;
`
const HR = styled.hr`
  grid-area: content;
  border: 8px solid red;
`

const LabelActionHeader = styled.label`
  margin-top: 20px;
  margin-left: 20px;
  font-weight: 500;
`
const InputActionHeader = styled.input`
  // margin-left: 15px;
  // margin-top: 8px;
  padding: 1px 0;
  height: 20px;
  width: 24px;
`
const ActionDescHeader = styled.span`
  margin-left: 10px;
  margin-bottom: 8px;
`

class WelcomeTrader extends Component {
  constructor(props) {
    super(props)
    this.firstReference = props.firstReference //this prop is set by SignIn and StartUp only
    this.dispatch = props.dispatch
    this.state = {}
    // console.log(`WelcomeTrader: constructor, props.firstReference=${props.firstReference}`)
  }

  componentDidMount() {
    // console.log(`WelcomeTrader: componentDidMount, getReference=${getReference()}, props.firstReference=${props.firstReference}`)
    if (this.firstReference) {
      // the first time mount from signIn or startup
      this.sandboxChecked = process.env.NODE_ENV === 'development' ? true : false // by default development gets junk ohlc values to test the app, but free downloads (default is changeable by user)
      setSandboxStatus(this.sandboxChecked) // set for reference in other modules such as Chartcell and reducePeekData.js

      // setSandboxStatus(true) // TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST TEST

      this.setState({ loading: true, reference: this.firstReference, useSandbox: getSandboxStatus() })
      // load a portfolio from persistant state now, only for first-time mounting
      this.loadPortfolio(this.firstReference)
    } else {
      // no need to load an initial protfolio, just show the UI using the existing protfolio
      this.setState({ loading: false, reference: getReference(), useSandbox: getSandboxStatus() })
    }
  }

  handleChange = (event) => {
    event.preventDefault()
    // console.log(`WelcomeTrader: handleChange getReference=${getReference()}`)
    this.loadPortfolio(event.target.value)
  }

  handleSandboxCheckboxChange = (e) => {
    const { name, checked } = e.target
    setSandboxStatus(checked) // set for reference in other modules such as reducePeekData.js
    this.setState({ [name]: checked })
  }

  loadPortfolio = (reference) => {
    try {
      putReference(reference) // establish the reference for the new portfolio
      resetDataCache() // clear all previously cached charting data for fresh start
      let persistedState = null // receives the state loaded from database
      // console.log(`loadPortfolioData begin:, reference=${reference}`)
      let that = this // for use below
      fire
        .database()
        .ref(reference) // see lib/dbReference.js for possible values
        .once('value')
        .then(async function(snapshot) {
          if (snapshot) {
            persistedState = snapshot.val()
            if (persistedState === null) {
              // the snapshot.val is null if no saved data is found,
              // so we will create the app's default state and it will be saved to storage
              that.props.dispatch(resetDefaultState())
            } else {
              // the saved data was recovered and can be used to set the app's state in memory
              that.props.dispatch(resetPersistedState(persistedState))

              let currentState = that.props.state

              // These are async operations that should be finished when accessed by ChartsView
              await setPeekPrices(currentState) // Put the current peek prices into the LastPeekPrice cache for use later in ChartsView
              await setDailyPrices(currentState, that.props.dispatch) // Load the daily price data for the portfolio's symbols
            }
            // console.log(`AppLoadData DB finish:, reference=${reference}`)
            document.title = 'AcesTrader ' + reference[0].toUpperCase() + reference.substr(1)
            that.setState({ loading: false, reference: reference }) //loading is finished, show the UI.
          } else {
            console.log('Firebase: The App database read returned an unsuccessful messsage')
            alert('Firebase: The App database read returned an unsuccessful messsage')
            debugger //pause for developer
          }
        })
        .catch((error) => {
          console.log('Firebase: The WelcomeTrader.js database read failed while retrieving the state. Error: ' + error)
          alert('Firebase: The WelcomeTrader.js database read failed while retrieving the state. Error: ' + error)
          debugger //pause for developer
        })
    } catch (err) {
      console.log('Firebase: The WelcomeTrader.js database read failed while retrieving the state. Error: ' + err.message)
      alert('Firebase: The WelcomeTrader.js database read failed while retrieving the state. Error: ' + err.message)
      debugger //pause for developer
    }
  }

  render() {
    const { loading, reference } = this.state

    if (!reference) return null //let componentDidMount decide on rendering

    // console.log(`WelcomeTrader  render: reference=${reference}, loading=${loading}`)

    const SelectedTitle = reference[0].toUpperCase() + reference.substr(1)

    if (loading) {
      // console.log('WelcomeTrader,  returns: Loading...')
      return (
        <Wrapper>
          <Background>
            <Title>{SelectedTitle} Portfolio Is Loading. Please Wait...</Title>
          </Background>
        </Wrapper>
      )
    } else {
      // console.log('WelcomeTrader  return: DOM')
      return (
        <Wrapper>
          <Background>
            <Title>{SelectedTitle} Portfolio Loaded</Title>
          </Background>
          <HR />
          <Header>Select A Portfolio</Header>
          <Content>
            <ControlGroup>
              <RadioGroupItem>
                <RadioInput type='radio' name={schwab} value={schwab} checked={reference === schwab} onChange={this.handleChange} />
                <RadioLabel>&nbsp;Schwab</RadioLabel>
              </RadioGroupItem>
              <RadioGroupItem>
                <RadioInput type='radio' name={ameritrade} value={ameritrade} checked={reference === ameritrade} onChange={this.handleChange} />
                <RadioLabel>&nbsp;Ameritrade</RadioLabel>
              </RadioGroupItem>
              <RadioGroupItem>
                <RadioInput type='radio' name={paper} value={paper} checked={reference === paper} onChange={this.handleChange} />
                <RadioLabel>&nbsp;Paper</RadioLabel>
              </RadioGroupItem>
            </ControlGroup>

            <ControlGroup>
              <LabelActionHeader>
                <InputActionHeader type='checkbox' name='useSandbox' checked={this.state.useSandbox} onChange={this.handleSandboxCheckboxChange} />
                <ActionDescHeader>Use Sandbox</ActionDescHeader>
              </LabelActionHeader>
            </ControlGroup>
          </Content>
        </Wrapper>
      )
    }
  }
}

//Note: this provides access to redux's dispatch()
//Use a no-op function to avoid triggering a re-render due to a state change.
//We are not concerned with state, we only want to run when called,
//but we need access to dispatch()
// const mapStateToProps = () => ({})
const mapStateToProps = (state) => ({
  state: state,
})
const mapDispatchToProps = (dispatch) => ({
  dispatch: dispatch,
})

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(WelcomeTrader)
)

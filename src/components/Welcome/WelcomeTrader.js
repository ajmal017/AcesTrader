// WelcomeTrader.js

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import styled from 'styled-components'
import './WelcomeTrader.css'
import { resetDefaultState, resetPersistedState } from '../../redux/index.js'
import { putReference, getReference, ameritrade, schwab, paper } from '../../lib/dbReference'
import { resetPeekPrices } from '../../lib/appLastPeekPrice'
import { resetDataCache } from '../../lib/chartDataCache'
import fire from '../../fire'

const Wrapper = styled.section`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto; 1fr 30px;
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
const RadioGroup = styled.section`
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

// let savedReference = null

class WelcomeTrader extends Component {
  //
  constructor(props) {
    super(props)
    // savedReference = getReference() ? getReference() : null
    this.firstReference = props.firstReference
    this.dispatch = props.dispatch
    this.state = {}
    // console.log(`WelcomeTrader: constructor, props.firstReference=${props.firstReference}`) //BCM
  }

  componentDidMount() {
    // console.log(`WelcomeTrader: componentDidMount, getReference=${getReference()}, props.firstReference=${props.firstReference}`) //BCM
    if (this.firstReference) {
      // load a portfolio now, only for first-time mounting
      this.loadPortfolio(this.firstReference)
    } else {
      // no need to load an initial protfolio, just show the UI using the existing protfolio
      this.setState({ loading: false, reference: getReference() })
    }
  }

  handleChange = (event) => {
    event.preventDefault()
    // console.log(`WelcomeTrader: handleChange getReference=${getReference()}`) //BCM
    this.loadPortfolio(event.target.value)
  }

  loadPortfolio = (reference) => {
    try {
      this.setState({ loading: true, reference: reference })
      resetDataCache() // clear all previously cached chart price data for fresh start
      resetPeekPrices() //clear old peek symbol prices for fresh start
      let persistedState = null // receives the state loaded from database
      // console.log(`loadPortfolioData begin:, reference=${reference}`) //BCM
      let that = this // for use below
      fire
        .database()
        .ref(reference) // see lib/dbReference.js for possible values
        .once('value')
        .then(function (snapshot) {
          if (snapshot) {
            persistedState = snapshot.val()
            if (persistedState === null) {
              // the snapshot.val is null if no saved data is found,
              // so we will create the app's default state and it will be saved to storage
              that.props.dispatch(resetDefaultState())
            } else {
              // the saved data was recovered and can be used to set the app's state in memory
              that.props.dispatch(resetPersistedState(persistedState))
            }
            // console.log(`AppLoadData DB finish:, reference=${reference}`) //BCM
            putReference(reference) // establish the reference for the new portfolio
            document.title = 'AcesTrader ' + reference[0].toUpperCase() + reference.substr(1)
            that.setState({ loading: false, reference: reference }) //loading is finished, show the UI.
          } else {
            console.log('Firebase: The App database read returned an unsuccessful messsage')
            debugger //pause for developer
          }
        })
        .catch((error) => {
          console.log('Firebase: The App/index database read failed while retrieving the state. Error: ' + error)
          debugger //pause for developer
        })
    } catch (err) {
      console.log('Firebase: The StartUp/index database read failed while retrieving the state. Error: ' + err.message)
      debugger //pause for developer
    }
  }

  render() {
    const { loading, reference } = this.state

    if (!reference) return null //let componentDidMount decide on rendering

    // console.log(`WelcomeTrader  render: reference=${reference}, loading=${loading}`) //BCM

    const SelectedTitle = reference[0].toUpperCase() + reference.substr(1)

    if (loading) {
      // console.log('WelcomeTrader,  returns: Loading...') //BCM
      return (
        <Wrapper>
          <Background>
            <Title>{SelectedTitle} Portfolio Is Loading. Please Wait...</Title>
          </Background>
        </Wrapper>
      )
    } else {
      // console.log('WelcomeTrader  return: DOM') //BCM
      return (
        <Wrapper>
          <Background>
            <Title>{SelectedTitle} Portfolio Loaded</Title>
          </Background>
          <HR />
          <Header>Select A Portfolio</Header>
          <Content>
            <RadioGroup>
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
            </RadioGroup>
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
const mapStateToProps = () => ({})
export default withRouter(connect(mapStateToProps)(WelcomeTrader))

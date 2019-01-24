// WelcomeRealTrader.js

import React, { Component } from 'react'
import { withRouter } from 'react-router'
import styled from 'styled-components'
import './WelcomeRealTrader.css'
import { putReference, getReference, ameritrade, schwab, paper } from '../../lib/dbReference'
import { referenceRealtrader, referencePapertrader, referenceDebugtrader } from '../../lib/dbReference'
import AppLoadData from '../AppLoadData'

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
// const Footer = styled.section`
//   grid-area: footer;
//   display: flex;
//   flex-flow: row wrap;
//   justify-content: center;
//   margin-top: 52px;
//   font-size: 22px;
// `

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

// const ButtonStart = styled.button`
//   font-size: 22px;
//   padding: 5px 10px 5px 10px;
//   :hover {
//     background: #adb5bd;
//   }
// `

const HR = styled.hr`
  grid-area: content;
  border: 8px solid red;
`

let savedReference = null

class WelcomeRealTrader extends Component {
  //
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    // console.log(`WelcomeRealTrader: constructor getReference=${getReference()}`) //BCM
    savedReference = getReference() ? getReference() : null
    this.state = { reference: savedReference }
  }

  componentDidMount() {
    // console.log(`WelcomeRealTrader: componentDidMount getReference=${getReference()}`) //BCM
  }

  handleChange = (event) => {
    event.preventDefault()
    savedReference = getReference()
    putReference(event.target.value)
    // console.log(`WelcomeRealTrader: handleChange savedReference=${savedReference} getReference=${getReference()}`) //BCM
    this.setState({ reference: getReference() }) //triggers render and identifies the Firebase RTDB index for the app's selected state
    // this.props.history.push('/startUp')
  }

  render() {
    const { reference } = this.state
    // console.log(`WelcomeRealTrader  render: savedReference=${savedReference} reference=${reference}`) //BCM
    const SelectedTitle = reference[0].toUpperCase() + reference.substr(1)
    putReference(reference) //BCM needed??

    if (savedReference !== reference) {
      // console.log('WelcomeRealTrader  return: DOM & AppLoadData') //BCM
      savedReference = reference // update this for use in the next render call
      return (
        <>
          <Wrapper>
            <Background>
              <Title>{SelectedTitle} Portfolio Is Loading. Please Wait...</Title>
            </Background>
          </Wrapper>
          <AppLoadData next={'WelcomeRealTrader'} />>
        </>
      )
    } else {
      // console.log('WelcomeRealTrader  return: DOM only') //BCM
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

            {process.env.NODE_ENV === 'development' ? (
              <RadioGroup>
                <RadioGroupItem>
                  <RadioInput type='radio' name={referenceRealtrader} value={referenceRealtrader} checked={reference === referenceRealtrader} onChange={this.handleChange} />
                  <RadioLabel>&nbsp;Live Trading</RadioLabel>
                </RadioGroupItem>
                <RadioGroupItem>
                  <RadioInput type='radio' name={referencePapertrader} value={referencePapertrader} checked={reference === referencePapertrader} onChange={this.handleChange} />
                  <RadioLabel>&nbsp;Paper Money Trading</RadioLabel>
                </RadioGroupItem>
                <RadioGroupItem>
                  <RadioInput type='radio' name={referenceDebugtrader} value={referenceDebugtrader} checked={reference === referenceDebugtrader} onChange={this.handleChange} />
                  <RadioLabel>&nbsp;Simulated Trading</RadioLabel>
                </RadioGroupItem>
              </RadioGroup>
            ) : (
              <div />
            )}
          </Content>
        </Wrapper>
      )
    }
  }
}
export default withRouter(WelcomeRealTrader)

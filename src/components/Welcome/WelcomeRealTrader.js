// WelcomeRealTrader.js

import React, { Component } from 'react'
import { withRouter } from 'react-router'
import styled from 'styled-components'
import { putReference, getReference, ameritrade, schwab, paper } from '../../lib/dbReference'
import { referenceRealtrader, referencePapertrader, referenceDebugtrader } from '../../lib/dbReference'

class WelcomeRealTrader extends Component {
  //
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    // this.handleStart = this.handleStart.bind(this)
    console.log(`WelcomeRealTrader: constructor getReference=${getReference()}`) //BCM
    this.state = getReference() ? { reference: getReference() } : {}
  }

  componentDidMount() {
    console.log(`WelcomeRealTrader: componentDidMount getReference=${getReference()}`) //BCM
  }

  handleChange = (event) => {
    event.preventDefault()
    putReference(event.target.value)
    this.setState({ reference: event.target.value }) //change account selection in view
    this.props.history.push('/startUp')
  }

  // handleStart = (event) => {
  //   event.preventDefault()
  //   putReference(this.state.reference) // this is the selected database reference
  //   this.props.history.push('/startUp')
  // }

  render() {
    const Wrapper = styled.section`
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: auto; 1fr 30px;
      grid-template-areas:
      'header'
      'content'
      'footer';
    `
    const Header = styled.h2`
      grid-area: header;
      margin-top: 100px;
      margin-bottom: 50px;
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
    const RadioRow = styled.section`
      display: flex;
      flex-flow: row wrap;
      justify-content: center;
      align-items: center;
      margin-top: 4px;
      margin-bottom: 56px;
    `
    const RadioInput = styled.input`
      width: 37px;
      height: 37px;
      cursor: 'pointer';
      // border: 4px;
    `
    const RadioLabel = styled.span`
      // width: 37px;
      height: 20px;
      // padding-bottom: 12px;
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

    putReference(this.state.reference)
    return (
      <Wrapper>
        <Header>Choose Account To Trade</Header>
        <Content>
          <RadioRow>
            <RadioInput type='radio' name={ameritrade} value={ameritrade} checked={this.state.reference === ameritrade} onChange={this.handleChange} />
            <RadioLabel>&nbsp;TD Ameritrade</RadioLabel>
            <RadioInput type='radio' name={schwab} value={schwab} checked={this.state.reference === schwab} onChange={this.handleChange} />
            <RadioLabel>&nbsp;Schwab</RadioLabel>
            <RadioInput type='radio' name={paper} value={paper} checked={this.state.reference === paper} onChange={this.handleChange} />
            <RadioLabel>&nbsp;Paper</RadioLabel>
          </RadioRow>

          {process.env.NODE_ENV === 'development' ? (
            <RadioRow>
              <RadioInput type='radio' name={referenceRealtrader} value={referenceRealtrader} checked={this.state.reference === referenceRealtrader} onChange={this.handleChange} />
              <RadioLabel>&nbsp;Live Trading</RadioLabel>
              <RadioInput
                type='radio'
                name={referencePapertrader}
                value={referencePapertrader}
                checked={this.state.reference === referencePapertrader}
                onChange={this.handleChange}
              />
              <RadioLabel>&nbsp;Paper Money Trading</RadioLabel>
              <RadioInput
                type='radio'
                name={referenceDebugtrader}
                value={referenceDebugtrader}
                checked={this.state.reference === referenceDebugtrader}
                onChange={this.handleChange}
              />
              <RadioLabel>&nbsp;Simulated Trading</RadioLabel>
            </RadioRow>
          ) : (
            <div />
          )}
        </Content>

        {/* <Footer>
          <ButtonStart onClick={this.handleStart}>Start</ButtonStart>
        </Footer> */}
      </Wrapper>
    )
  }
}
export default withRouter(WelcomeRealTrader)

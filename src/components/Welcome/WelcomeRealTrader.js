// WelcomeRealTrader.js

import React, { Component } from 'react'
import styled from 'styled-components'
import { putReference, getReference, ameritrade, schwab, paper } from '../../lib/dbReference'
import { referenceRealtrader, referencePapertrader, referenceDebugtrader } from '../../lib/dbReference'

class WelcomeRealTrader extends Component {
  //
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleStart = this.handleStart.bind(this)
    this.state = getReference() ? { reference: getReference() } : {}
  }

  componentDidMount() {
    this.setState({ reference: getReference() })
  }

  handleChange = (event) => {
    putReference(event.target.value)
    this.setState({ reference: event.target.value }) //change Database selection
  }

  handleStart = async (event) => {
    event.preventDefault()
    putReference(this.state.reference) // this is the selected database reference
    this.props.history.push('/startUp')
  }

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
      margin-bottom: 30px;
      justify-self: center;
    `
    const Content = styled.section`
      grid-area: content;
      padding-right: 14%;
      padding-left: 14%;
      background-color: #ecf0f1;     
    `

    const Footer = styled.section`
      grid-area: footer;
      display: flex;
      flex-flow: row wrap;
      justify-content: center;
      margin-top: 52px;
      font-size: 22px;
    `

    const RadioRow = styled.section`
      display: flex;
      flex-flow: row wrap;
      justify-content: center;
      // justify-content: space-evenly;
      align-items: center;
      margin-top: 4px;
      margin-bottom: 16px;
    `
    const RadioItem = styled.section`
      // margin-left: 20px;
      margin-right: 20px;
      height: 30px;
    `
    const RadioInput = styled.input`
      width: 17px;
      height: 17px;
      margin-top: 52px;
    `
    // const RadioLabel = styled.label`
    //   display: inline-block;
    //   max-width: 100%;
    //   // margin-top: -18px;
    //   padding-bottom: 52px;
    //   // font-weight: bold;
    // `

    const ButtonStart = styled.button`
      font-size: 22px;
      padding: 5px 10px 5px 10px;
      :hover {
        background: #adb5bd;
      }
    `

    putReference(this.state.reference)
    return (
      <Wrapper>
        <Header>Choose Account To Trade</Header>
        <Content>
          <RadioRow>
            <RadioItem>
              <RadioInput type='radio' name={ameritrade} value={ameritrade} checked={this.state.reference === ameritrade} onChange={this.handleChange} />
              <label htmlFor='ameritrade'>&nbsp;TD Ameritrade</label>
            </RadioItem>
            <RadioItem>
              <RadioInput type='radio' name={schwab} value={schwab} checked={this.state.reference === schwab} onChange={this.handleChange} />
              <label htmlFor='schwab'>&nbsp;Schwab</label>
            </RadioItem>
            <RadioItem>
              <RadioInput type='radio' name={paper} value={paper} checked={this.state.reference === paper} onChange={this.handleChange} />
              <label htmlFor='paper'>&nbsp;Paper</label>
            </RadioItem>
          </RadioRow>

          {process.env.NODE_ENV === 'development' ? (
            <RadioRow>
              <RadioItem>
                <RadioInput
                  type='radio'
                  name={referenceRealtrader}
                  value={referenceRealtrader}
                  checked={this.state.reference === referenceRealtrader}
                  onChange={this.handleChange}
                />
                <label htmlFor='referenceRealtrader'>&nbsp;Live Trading</label>
              </RadioItem>
              <RadioItem>
                <RadioInput
                  type='radio'
                  name={referencePapertrader}
                  value={referencePapertrader}
                  checked={this.state.reference === referencePapertrader}
                  onChange={this.handleChange}
                />
                <label htmlFor='referencePapertrader'>&nbsp;Paper Money Trading</label>
              </RadioItem>
              <RadioItem>
                <RadioInput
                  type='radio'
                  name={referenceDebugtrader}
                  value={referenceDebugtrader}
                  checked={this.state.reference === referenceDebugtrader}
                  onChange={this.handleChange}
                />
                <label htmlFor='referenceDebugtrader'>&nbsp;Simulated Trading</label>
              </RadioItem>
            </RadioRow>
          ) : (
            <div />
          )}
        </Content>
        <Footer>
          <ButtonStart onClick={this.handleStart}>
            Start
          </ButtonStart>
        </Footer>
      </Wrapper>
    )
  }
}
export default WelcomeRealTrader
